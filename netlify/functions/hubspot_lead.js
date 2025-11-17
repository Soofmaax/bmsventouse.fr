// Netlify Function: Create/Update a HubSpot contact from site lead payloads
// Requires a HubSpot Private App token set as env: HUBSPOT_PRIVATE_APP_TOKEN
// Optionally override API base via HUBSPOT_API_BASE (defaults to https://api.hubapi.com)

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
    const baseProps = {
      email: email || undefined,
      phone: phone || undefined,
      firstname: firstName || undefined,
      lastname: lastName || undefined,
      company: company || undefined,
      jobtitle: role || undefined,
      lifecyclestage: 'lead'
    };

    // Recherche d'un contact existant par email OU téléphone
    const existing = await findContact(API_BASE, token, { email, phone });

    if (existing && existing.id) {
      // Mise à jour partielle
      await hubspotFetch(API_BASE + `/crm/v3/objects/contacts/${encodeURIComponent(existing.id)}`, token, {
        method: 'PATCH',
        body: JSON.stringify({ properties: baseProps })
      });
      // On ne tente pas de créer des propriétés custom ici (stabilité). Les détails restent côté Netlify Forms.
      return { statusCode: 200, headers: corsHeaders(), body: JSON.stringify({ ok: true, action: 'updated', id: existing.id }) };
    }

    // Création du contact
    const createRes = await hubspotFetch(API_BASE + '/crm/v3/objects/contacts', token, {
      method: 'POST',
      body: JSON.stringify({ properties: baseProps })
    });
    const created = await createRes.json().catch(() => ({}));
    return { statusCode: 200, headers: corsHeaders(), body: JSON.stringify({ ok: true, action: 'created', id: created.id || null }) };

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