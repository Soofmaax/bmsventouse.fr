// Netlify Function: email_forward
// Purpose: Receive JSON payload from forms and forward as an email (SendGrid or Mailjet).
// Configure one of these providers via environment variables on Netlify:
//
// Option A: SendGrid
//   - SENDGRID_API_KEY
//   - EMAIL_FROM (e.g., "no-reply@bmsventouse.fr")
//   - EMAIL_TO   (destination email, e.g., "contact@bmsventouse.fr")
//
// Option B: Mailjet
//   - MAILJET_API_KEY
//   - MAILJET_API_SECRET
//   - EMAIL_FROM (From email)
//   - EMAIL_TO   (To email)
//
// This function does not store data; it only forwards email. Keep Netlify Forms for a backup record if desired.

exports.handler = async (event) => {
  try {
    if (event.httpMethod === 'OPTIONS') {
      return { statusCode: 200, headers: corsHeaders(), body: '' };
    }
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, headers: corsHeaders(), body: JSON.stringify({ error: 'method_not_allowed' }) };
    }

    const body = safeJson(event.body);
    // Basic anti-abuse: require at least email or phone or fullname
    const fullname = (body.fullname || body.name || '').trim();
    const email = (body.email || '').trim();
    const phone = (body.phone || '').trim();
    if (!fullname && !email && !phone) {
      return { statusCode: 400, headers: corsHeaders(), body: JSON.stringify({ error: 'missing_contact' }) };
    }

    // Provider selection
    const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || '';
    const MJ_API_KEY = process.env.MAILJET_API_KEY || '';
    const MJ_API_SECRET = process.env.MAILJET_API_SECRET || '';
    const EMAIL_FROM = process.env.EMAIL_FROM || 'no-reply@bmsventouse.fr';
    const EMAIL_TO = process.env.EMAIL_TO || 'contact@bmsventouse.fr';

    if (!EMAIL_TO) {
      return { statusCode: 501, headers: corsHeaders(), body: JSON.stringify({ error: 'mail_not_configured' }) };
    }

    const subject = buildSubject(body);
    const text = buildPlainText(body);
    const html = buildHtml(body);

    let ok = false;
    if (SENDGRID_API_KEY) {
      ok = await sendViaSendGrid({ apiKey: SENDGRID_API_KEY, from: EMAIL_FROM, to: EMAIL_TO, subject, text, html });
    } else if (MJ_API_KEY && MJ_API_SECRET) {
      ok = await sendViaMailjet({ apiKey: MJ_API_KEY, apiSecret: MJ_API_SECRET, from: EMAIL_FROM, to: EMAIL_TO, subject, text, html });
    } else {
      // No provider configured
      return { statusCode: 501, headers: corsHeaders(), body: JSON.stringify({ error: 'email_provider_not_configured' }) };
    }

    if (!ok) {
      return { statusCode: 502, headers: corsHeaders(), body: JSON.stringify({ error: 'mail_delivery_failed' }) };
    }

    return { statusCode: 200, headers: corsHeaders(), body: JSON.stringify({ ok: true }) };
  } catch (e) {
    return { statusCode: 500, headers: corsHeaders(), body: JSON.stringify({ error: 'internal_error' }) };
  }
};

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };
}

function safeJson(str) {
  try { return JSON.parse(str || '{}'); } catch (_) { return {}; }
}

function buildSubject(data) {
  const service = data.service || data.service_interest || 'Demande';
  const company = data.company ? ` - ${data.company}` : '';
  const urgent = data.urgent ? ' [URGENT]' : '';
  return `Nouveau formulaire: ${service}${company}${urgent}`;
}

function buildPlainText(d) {
  const lines = [];
  const p = (k, v) => lines.push(`${k}: ${v || '—'}`);
  p('Nom', d.fullname || d.name);
  p('Société', d.company);
  p('Email', d.email);
  p('Téléphone', d.phone);
  p('Rôle', d.role);
  p('Service', d.service || d.service_interest);
  p('Pack', d.package);
  p('Ville', d.location);
  p('Adresse', d.address);
  p('Horaires', d.schedule);
  p('Urgent', d.urgent ? 'Oui' : 'Non');
  p('Date début', d.date_start);
  p('Date fin', d.date_end);
  p('Préférence paiement', d.payment_preference);
  p('Budget', d.budget);
  if (d.estimate_min || d.estimate_max) {
    p('Estimation min', d.estimate_min);
    p('Estimation max', d.estimate_max);
  }

  // Détails par service
  if (d.service && String(d.service).toLowerCase().includes('cantine')) {
    lines.push('');
    lines.push('— Cantine & Catering —');
    p('Personnes', d.svc_cantine_people || d.cantine_people);
    p('Repas', d.svc_cantine_meals || d.cantine_meals);
    p('Régimes', d.svc_cantine_dietary || d.cantine_dietary);
    p('Horaires', d.svc_cantine_hours || d.cantine_hours);
  }
  if (d.service && String(d.service).toLowerCase().includes('ventousage')) {
    lines.push('');
    lines.push('— Ventousage —');
    p('Zones', d.svc_ventousage_zones || d.zones);
    p('Rues', d.svc_ventousage_streets || d.ventousage_streets);
    p('Horaires', d.svc_ventousage_hours || d.ventousage_hours);
  }
  if (d.service && (String(d.service).toLowerCase().includes('sécurité') || String(d.service).toLowerCase().includes('gardiennage'))) {
    lines.push('');
    lines.push('— Sécurité/Gardiennage —');
    p('Agents', d.svc_securite_agents || d.agents);
    p('Heures/jour', d.svc_securite_hours || d.hours);
    p('SSIAP', (d.svc_securite_ssiap || d.ssiap) ? 'Oui' : 'Non');
  }
  if (d.service && String(d.service).toLowerCase().includes('convoyage')) {
    lines.push('');
    lines.push('— Convoyage —');
    p('Distance (km)', d.km);
    p('Volume', d.svc_convoyage_volume || d.volume);
    p('Départ', d.svc_convoyage_pickup || d.convoyage_pickup);
    p('Arrivée', d.svc_convoyage_drop || d.convoyage_drop);
    p('Stops', d.svc_convoyage_stops || d.convoyage_stops);
    p('Créneaux', d.svc_convoyage_schedule || d.convoyage_schedule);
  }
  if (d.service && String(d.service).toLowerCase().includes('signalisation')) {
    lines.push('');
    lines.push('— Signalisation & Barriérage —');
    p('Périmètre', d.svc_signalisation_perimeter || d.signalisation_perimeter);
    p('Barrières', d.svc_signalisation_barriers || d.signalisation_barriers);
    p('Heures/jour', d.svc_signalisation_hours || d.signalisation_hours);
  }
  if (d.service && String(d.service).toLowerCase().includes('affichage')) {
    lines.push('');
    lines.push('— Affichage Riverains —');
    p('Rues', d.svc_affichage_streets || d.affichage_streets);
    p('Panneaux/Affiches', d.svc_affichage_posters || d.affichage_posters);
  }
  if (d.service && String(d.service).toLowerCase().includes('régie')) {
    lines.push('');
    lines.push('— Régie & Matériel —');
    p('Matériel', d.svc_regie_equipment || d.regie_equipment);
    p('Agents', d.svc_regie_agents || d.regie_agents);
    p('Heures/jour', d.svc_regie_hours || d.regie_hours);
  }
  if (d.service && (String(d.service).toLowerCase().includes('loges') || String(d.service).toLowerCase().includes('confort'))) {
    lines.push('');
    lines.push('— Loges & Confort —');
    p('Loges', d.svc_loges_number || d.loges_number);
    p('Types', d.svc_loges_types || d.loges_types);
    p('Localisation', d.svc_loges_location || d.loges_location);
  }

  if (d.details) {
    lines.push('');
    lines.push('— Détails —');
    lines.push(String(d.details));
  }

  return lines.join('\n');
}

function buildHtml(d) {
  const esc = (s) => String(s || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',\"'\":'&#39;'}[c]));
  const line = (k,v) => `<tr><td style="padding:6px 10px;color:#555;"><strong>${esc(k)}</strong></td><td style="padding:6px 10px;color:#111;">${esc(v||'—')}</td></tr>`;
  let rows = '';
  rows += line('Nom', d.fullname || d.name);
  rows += line('Société', d.company);
  rows += line('Email', d.email);
  rows += line('Téléphone', d.phone);
  rows += line('Rôle', d.role);
  rows += line('Service', d.service || d.service_interest);
  rows += line('Pack', d.package);
  rows += line('Ville', d.location);
  rows += line('Adresse', d.address);
  rows += line('Horaires', d.schedule);
  rows += line('Urgent', d.urgent ? 'Oui' : 'Non');
  rows += line('Date début', d.date_start);
  rows += line('Date fin', d.date_end);
  rows += line('Paiement', d.payment_preference);
  rows += line('Budget', d.budget);

  const section = (title, obj) => {
    if (!obj) return '';
    return `<tr><td colspan="2" style="padding:10px 10px;color:#111;background:#f6f6f6;border-top:1px solid #eee;"><strong>${esc(title)}</strong></td></tr>${obj}`;
  };

  if (d.service && String(d.service).toLowerCase().includes('cantine')) {
    rows += section('Cantine & Catering',
      line('Personnes', d.svc_cantine_people || d.cantine_people) +
      line('Repas', d.svc_cantine_meals || d.cantine_meals) +
      line('Régimes', d.svc_cantine_dietary || d.cantine_dietary) +
      line('Horaires', d.svc_cantine_hours || d.cantine_hours)
    );
  }
  if (d.service && String(d.service).toLowerCase().includes('ventousage')) {
    rows += section('Ventousage',
      line('Zones', d.svc_ventousage_zones || d.zones) +
      line('Rues', d.svc_ventousage_streets || d.ventousage_streets) +
      line('Horaires', d.svc_ventousage_hours || d.ventousage_hours)
    );
  }
  if (d.service && (String(d.service).toLowerCase().includes('sécurité') || String(d.service).toLowerCase().includes('gardiennage'))) {
    rows += section('Sécurité / Gardiennage',
      line('Agents', d.svc_securite_agents || d.agents) +
      line('Heures/jour', d.svc_securite_hours || d.hours) +
      line('SSIAP', (d.svc_securite_ssiap || d.ssiap) ? 'Oui' : 'Non')
    );
  }
  if (d.service && String(d.service).toLowerCase().includes('convoyage')) {
    rows += section('Convoyage',
      line('Distance (km)', d.km) +
      line('Volume', d.svc_convoyage_volume || d.volume) +
      line('Départ', d.svc_convoyage_pickup || d.convoyage_pickup) +
      line('Arrivée', d.svc_convoyage_drop || d.convoyage_drop) +
      line('Stops', d.svc_convoyage_stops || d.convoyage_stops) +
      line('Créneaux', d.svc_convoyage_schedule || d.convoyage_schedule)
    );
  }
  if (d.service && String(d.service).toLowerCase().includes('signalisation')) {
    rows += section('Signalisation & Barriérage',
      line('Périmètre', d.svc_signalisation_perimeter || d.signalisation_perimeter) +
      line('Barrières', d.svc_signalisation_barriers || d.signalisation_barriers) +
      line('Heures/jour', d.svc_signalisation_hours || d.signalisation_hours)
    );
  }
  if (d.service && String(d.service).toLowerCase().includes('affichage')) {
    rows += section('Affichage Riverains',
      line('Rues', d.svc_affichage_streets || d.affichage_streets) +
      line('Panneaux/Affiches', d.svc_affichage_posters || d.affichage_posters)
    );
  }
  if (d.service && String(d.service).toLowerCase().includes('régie')) {
    rows += section('Régie & Matériel',
      line('Matériel', d.svc_regie_equipment || d.regie_equipment) +
      line('Agents', d.svc_regie_agents || d.regie_agents) +
      line('Heures/jour', d.svc_regie_hours || d.regie_hours)
    );
  }
  if (d.service && (String(d.service).toLowerCase().includes('loges') || String(d.service).toLowerCase().includes('confort'))) {
    rows += section('Loges & Confort',
      line('Loges', d.svc_loges_number || d.loges_number) +
      line('Types', d.svc_loges_types || d.loges_types) +
      line('Localisation', d.svc_loges_location || d.loges_location)
    );
  }

  if (d.details) {
    rows += section('Détails', `<tr><td colspan="2" style="padding:6px 10px;color:#111;white-space:pre-line;">${esc(d.details)}</td></tr>`);
  }

  return `
  <div style="font-family:Arial,sans-serif;font-size:14px;color:#111;">
    <h2 style="margin:0 0 10px 0;">Nouvelle demande depuis bmsventouse.fr</h2>
    <table cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;">
      ${rows}
    </table>
  </div>`;
}

async function sendViaSendGrid({ apiKey, from, to, subject, text, html }) {
  try {
    const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: to }] }],
        from: { email: from },
        subject,
        content: [
          { type: 'text/plain', value: text },
          { type: 'text/html', value: html }
        ]
      })
    });
    return res.ok;
  } catch {
    return false;
  }
}

async function sendViaMailjet({ apiKey, apiSecret, from, to, subject, text, html }) {
  try {
    const res = await fetch('https://api.mailjet.com/v3.1/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa(apiKey + ':' + apiSecret)
      },
      body: JSON.stringify({
        Messages: [
          {
            From: { Email: from },
            To: [{ Email: to }],
            Subject: subject,
            TextPart: text,
            HTMLPart: html
          }
        ]
      })
    });
    return res.ok;
  } catch {
    return false;
  }
}