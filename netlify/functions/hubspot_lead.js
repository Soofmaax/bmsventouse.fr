// Netlify Function: Create/Update a HubSpot contact from site lead payloads
// Requires a HubSpot Private App token set as env: HUBSPOT_PRIVATE_APP_TOKEN
// Optionally override API base via HUBSPOT_API_BASE (defaults to https://api.hubapi.com)
// Optional custom property mapping via env:
//   HUBSPOT_PROP_SERVICE, HUBSPOT_PROP_BUDGET, HUBSPOT_PROP_ESTIMATE_MIN, HUBSPOT_PROP_ESTIMATE_MAX,
//   HUBSPOT_PROP_URGENT, HUBSPOT_PROP_SOURCE, HUBSPOT_PROP_DETAILS

exports.handler = async (event) => {
  try {
    if (event.httpMethod === 'OPTIONS') {
      return { statusCode: 200, headers: corsHeaders(), body: '' };
    }
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, headers: corsHeaders(), body: JSON.stringify({ error: 'method_not_allowed' }) };
    }

    const token = process.env.HUBSPOT_PRIVATE_APP_TOKEN || '';
    const API_BASE = process.env.HUBSPOT_API_BASE || 'https://api.hubapi.com';
    if (!token) {
      // Non bloquant côté site (appel en fire-and-forget). On remonte un 501 explicite.
      return { statusCode: 501, headers: corsHeaders(), body: JSON.stringify({ error: 'hubspot_not_configured' }) };
    }

    const payload = safeJsonParse(event.body);
    if (!payload || !payload.consent) {
      return { statusCode: 400, headers: corsHeaders(), body: JSON.stringify({ error: 'consent_required' }) };
    }

    // Normalisation des champs connus
    const fullname = (payload.fullname || payload.name || '').trim();
    const company = (payload.company || '').trim();
    const email = (payload.email || '').trim();
    const phone = (String(payload.phone || '')).trim();
    const role = (payload.role || '').trim();
    const service = (payload.service || payload.service_interest || '').trim();
    const budget = (payload.budget || '').toString().trim();
    const details = (payload.details || '').toString().trim();
    const source = (payload.source || 'website').toString().trim();
    const urgent = !!payload.urgent;

    // Estimations éventuelles (devis)
    const estimateMin = Number.isFinite(payload.estimate_min) ? payload.estimate_min : parseInt(payload.estimate_min || '0', 10) || 0;
    const estimateMax = Number.isFinite(payload.estimate_max) ? payload.estimate_max : parseInt(payload.estimate_max || '0', 10) || 0;

    if (!email && !phone) {
      return { statusCode: 400, headers: corsHeaders(), body: JSON.stringify({ error: 'contact_required' }) };
    }

    // Découpe du nom complet
    const [firstName, ...rest] = fullname.split(/\s+/).filter(Boolean);
    const lastName = rest.join(' ') || (firstName ? '' : 'Lead');

    // Prépare les propriétés sûres (propriétés standards HubSpot uniquement)
    const props = {
      email: email || undefined,
      phone: phone || undefined,
      firstname: firstName || undefined,
      lastname: lastName || undefined,
      company: company || undefined,
      jobtitle: role || undefined,
      lifecyclestage: 'lead'
    };

    // Ajout conditionnel de propriétés custom si configurées dans l'env (elles doivent exister dans HubSpot)
    attachCustomProps(props, {
      service,
      budget,
      estimateMin,
      estimateMax,
      urgent,
      source,
      details
    });

    // Recherche d'un contact existant par email OU téléphone
    const existing = await findContact(API_BASE, token, { email, phone });

    let contactId = existing && existing.id ? existing.id : '';

    if (contactId) {
      // Mise à jour partielle
      await hubspotFetch(API_BASE + `/crm/v3/objects/contacts/${encodeURIComponent(contactId)}`, token, {
        method: 'PATCH',
        body: JSON.stringify({ properties: props })
      });
    } else {
      // Création du contact
      const createRes = await hubspotFetch(API_BASE + '/crm/v3/objects/contacts', token, {
        method: 'POST',
        body: JSON.stringify({ properties: props })
      });
      const created = await createRes.json().catch(() => ({}));
      contactId = created.id || '';
    }

    // Crée une Note avec le brief et l'associe au contact (non bloquant)
    try {
      const noteBody = buildNoteBody({
        fullname, company, email, phone, role, service, budget, details, source, urgent, estimateMin, estimateMax, payload
      });
      const noteId = await createNote(API_BASE, token, noteBody);
      if (noteId && contactId) {
        await associateNoteToContact(API_BASE, token, noteId, contactId);
      }
    } catch (_) {}

    return { statusCode: 200, headers: corsHeaders(), body: JSON.stringify({ ok: true, id: contactId || null }) };

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

function safeJsonParse(body) {
  try { return JSON.parse(body || '{}'); } catch { return {}; }
}

async function hubspotFetch(url, token, init) {
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
  const res = await fetch(url, { headers, ...init });
  return res;
}

async function findContact(API_BASE, token, { email, phone }) {
  const filterGroups = [];
  if (email) filterGroups.push({ filters: [{ propertyName: 'email', operator: 'EQ', value: email }] });
  if (phone) filterGroups.push({ filters: [{ propertyName: 'phone', operator: 'EQ', value: phone }] });
  if (filterGroups.length === 0) return null;

  const res = await hubspotFetch(API_BASE + '/crm/v3/objects/contacts/search', token, {
    method: 'POST',
    body: JSON.stringify({
      filterGroups,
      properties: ['email', 'phone', 'firstname', 'lastname'],
      limit: 1
    })
  });
  if (!res.ok) return null;
  const data = await res.json().catch(() => ({}));
  const results = (data && data.results) || [];
  return Array.isArray(results) && results.length ? results[0] : null;
}

// Ajoute des propriétés custom si l'env fournit les noms existants dans HubSpot
function attachCustomProps(props, extra) {
  const ENV_MAP = [
    { env: 'HUBSPOT_PROP_SERVICE', key: 'service' },
    { env: 'HUBSPOT_PROP_BUDGET', key: 'budget' },
    { env: 'HUBSPOT_PROP_ESTIMATE_MIN', key: 'estimateMin' },
    { env: 'HUBSPOT_PROP_ESTIMATE_MAX', key: 'estimateMax' },
    { env: 'HUBSPOT_PROP_URGENT', key: 'urgent' },
    { env: 'HUBSPOT_PROP_SOURCE', key: 'source' },
    { env: 'HUBSPOT_PROP_DETAILS', key: 'details' }
  ];
  ENV_MAP.forEach(({ env, key }) => {
    const propName = process.env[env];
    if (propName) {
      const val = extra[key];
      // Convert booleans to 'true'/'false' strings if necessary; otherwise set as-is
      props[propName] = typeof val === 'boolean' ? (val ? 'true' : 'false') : val;
    }
  });
}

// Construit le corps de la note (texte simple) avec les infos principales
function buildNoteBody(info) {
  const lines = [];
  const yn = (b) => (b ? 'Oui' : 'Non');
  const euro = (n) => {
    try { return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(Math.max(0, Math.round(n || 0))); }
    catch { return String(n); }
  };
  lines.push(`Lead site — ${info.source || 'website'}`);
  lines.push(`Nom: ${info.fullname || '—'}`);
  if (info.company) lines.push(`Société: ${info.company}`);
  lines.push(`Email: ${info.email || '—'}`);
  lines.push(`Téléphone: ${info.phone || '—'}`);
  if (info.role) lines.push(`Rôle: ${info.role}`);
  if (info.service) lines.push(`Service: ${info.service}`);
  if (info.budget) lines.push(`Budget: ${info.budget}`);
  lines.push(`Urgent: ${yn(!!info.urgent)}`);
  if (info.estimateMin || info.estimateMax) {
    lines.push(`Estimation: ${euro(info.estimateMin)} – ${euro(info.estimateMax)} HT`);
  }
  if (info.details) {
    lines.push('');
    lines.push('Détails:');
    lines.push(info.details);
  }
  // Ajouter un dump compact du payload si utile
  if (info.payload) {
    lines.push('');
    lines.push('Payload:');
    try { lines.push(JSON.stringify(info.payload)); } catch {}
  }
  return lines.join('\n');
}

async function createNote(API_BASE, token, body) {
  const res = await hubspotFetch(API_BASE + '/crm/v3/objects/notes', token, {
    method: 'POST',
    body: JSON.stringify({
      properties: {
        hs_note_body: body,
        hs_timestamp: new Date().toISOString()
      }
    })
  });
  if (!res.ok) return '';
  const data = await res.json().catch(() => ({}));
  return data.id || '';
}

async function associateNoteToContact(API_BASE, token, noteId, contactId) {
  // Association batch entre note et contact (direction: notes -> contacts)
  await hubspotFetch(API_BASE + '/crm/v3/associations/notes/contacts/batch/create', token, {
    method: 'POST',
    body: JSON.stringify({
      inputs: [
        { from: { id: noteId }, to: { id: contactId } }
      ]
    })
  });
}