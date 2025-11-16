exports.handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, headers: corsHeaders(), body: JSON.stringify({ error: 'method_not_allowed' }) };
    }

    const payload = JSON.parse(event.body || '{}');
    const email = (payload.email || '').trim();
    const phone = (payload.phone || '').trim();

    if (!email && !phone) {
      return { statusCode: 400, headers: corsHeaders(), body: JSON.stringify({ error: 'missing_contact' }) };
    }

    const CLIENT_ID = process.env.ZOHO_CLIENT_ID || '';
    const CLIENT_SECRET = process.env.ZOHO_CLIENT_SECRET || '';
    const REFRESH_TOKEN = process.env.ZOHO_REFRESH_TOKEN || '';

    const ACCOUNTS_DOMAIN = process.env.ZOHO_ACCOUNTS_DOMAIN || 'https://accounts.zoho.eu';
    const API_DOMAIN = process.env.ZOHO_API_DOMAIN || 'https://www.zohoapis.eu';

    if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
      // If not configured, default to eligible (so UX doesn't block)
      return { statusCode: 200, headers: corsHeaders(), body: JSON.stringify({ eligible: true, reason: 'not_configured' }) };
    }

    const accessToken = await getAccessToken(ACCOUNTS_DOMAIN, CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN);
    if (!accessToken) {
      return { statusCode: 500, headers: corsHeaders(), body: JSON.stringify({ error: 'token_error' }) };
    }

    // Helper: perform search in a module by criteria
    const foundInModule = async (moduleName) => {
      let criteria = '';
      if (email && phone) {
        criteria = `(Email:equals:${escapeCriteria(email)}) or (Phone:equals:${escapeCriteria(phone)})`;
      } else if (email) {
        criteria = `(Email:equals:${escapeCriteria(email)})`;
      } else if (phone) {
        criteria = `(Phone:equals:${escapeCriteria(phone)})`;
      }
      const url = `${API_DOMAIN}/crm/v2/${moduleName}/search?criteria=${encodeURIComponent(criteria)}`;
      const res = await fetch(url, { headers: { Authorization: `Zoho-oauthtoken ${accessToken}` } });
      if (!res.ok) return false;
      const data = await res.json().catch(() => ({}));
      const records = (data && data.data) || [];
      return Array.isArray(records) && records.length > 0;
    };

    const [leadFound, contactFound] = await Promise.all([
      foundInModule('Leads'),
      foundInModule('Contacts')
    ]);

    const eligible = !(leadFound || contactFound);

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

async function getAccessToken(accountsDomain, clientId, clientSecret, refreshToken) {
  const url = `${accountsDomain}/oauth/v2/token?refresh_token=${encodeURIComponent(refreshToken)}&client_id=${encodeURIComponent(clientId)}&client_secret=${encodeURIComponent(clientSecret)}&grant_type=refresh_token`;
  const res = await fetch(url, { method: 'POST' });
  if (!res.ok) return '';
  const data = await res.json().catch(() => ({}));
  return data.access_token || '';
}

function escapeCriteria(value) {
  // Escape characters that might break Zoho criteria
  return String(value).replace(/([\\)\\(\\:])/g, '\\$1');
}