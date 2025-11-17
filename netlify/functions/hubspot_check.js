// Netlify Function: Check eligibility (-15% new client) by verifying if a HubSpot contact exists.
// If HubSpot is not configured, returns eligible: true to avoid blocking UX.

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

    const payload = safeJsonParse(event.body);
    const email = (payload.email || '').trim();
    const phone = (payload.phone || '').trim();

    if (!email && !phone) {
      return { statusCode: 400, headers: corsHeaders(), body: JSON.stringify({ error: 'missing_contact' }) };
    }

    if (!token) {
      // Pas configuré: considérer éligible pour ne pas bloquer l'offre
      return { statusCode: 200, headers: corsHeaders(), body: JSON.stringify({ eligible: true, reason: 'not_configured' }) };
    }

    const found = await contactExists(API_BASE, token, { email, phone });
    const eligible = !found;

    return { statusCode: 200, headers: corsHeaders(), body: JSON.stringify({ eligible }) };
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

async function contactExists(API_BASE, token, { email, phone }) {
  const filterGroups = [];
  if (email) filterGroups.push({ filters: [{ propertyName: 'email', operator: 'EQ', value: email }] });
  if (phone) filterGroups.push({ filters: [{ propertyName: 'phone', operator: 'EQ', value: phone }] });
  if (filterGroups.length === 0) return false;

  const res = await hubspotFetch(API_BASE + '/crm/v3/objects/contacts/search', token, {
    method: 'POST',
    body: JSON.stringify({
      filterGroups,
      properties: ['email', 'phone'],
      limit: 1
    })
  });
  if (!res.ok) return false;
  const data = await res.json().catch(() => ({}));
  const results = (data && data.results) || [];
  return Array.isArray(results) && results.length > 0;
}