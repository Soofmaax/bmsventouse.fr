exports.handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, headers: corsHeaders(), body: JSON.stringify({ error: 'method_not_allowed' }) };
    }

    const payload = JSON.parse(event.body || '{}');
    if (!payload || !payload.consent) {
      return { statusCode: 400, headers: corsHeaders(), body: JSON.stringify({ error: 'consent_required' }) };
    }

    const {
      fullname = '',
      company = '',
      email = '',
      phone = '',
      service = '',
      estimate_min = 0,
      estimate_max = 0
    } = payload;

    // Minimal validation
    if (!email && !phone) {
      return { statusCode: 400, headers: corsHeaders(), body: JSON.stringify({ error: 'contact_required' }) };
    }

    // OAuth credentials from env
    const CLIENT_ID = process.env.ZOHO_CLIENT_ID || '';
    const CLIENT_SECRET = process.env.ZOHO_CLIENT_SECRET || '';
    const REFRESH_TOKEN = process.env.ZOHO_REFRESH_TOKEN || '';

    // Domains (EU by default)
    const ACCOUNTS_DOMAIN = process.env.ZOHO_ACCOUNTS_DOMAIN || 'https://accounts.zoho.eu';
    const API_DOMAIN = process.env.ZOHO_API_DOMAIN || 'https://www.zohoapis.eu';

    if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
      // Not configured yet; do not fail hard
      return { statusCode: 501, headers: corsHeaders(), body: JSON.stringify({ error: 'zoho_not_configured' }) };
    }

    const accessToken = await getAccessToken(ACCOUNTS_DOMAIN, CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN);
    if (!accessToken) {
      return { statusCode: 500, headers: corsHeaders(), body: JSON.stringify({ error: 'token_error' }) };
    }

    // Map to Zoho CRM Lead fields
    const [firstName, ...rest] = (fullname || '').trim().split(/\s+/);
    const lastName = rest.join(' ') || firstName || 'N/A';

    const description = [
      `Service: ${service || 'N/A'}`,
      `Estimation: ${estimate_min || 0} – ${estimate_max || 0} EUR`,
      `Payload: ${safeStringify(payload)}`
    ].join(' | ');

    const lead = {
      Company: company || 'N/A',
      Last_Name: lastName,
      First_Name: firstName || '',
      Email: email || '',
      Phone: phone || '',
      Lead_Source: 'Website',
      Description: description
      // To store custom fields, create them in Zoho and add here, e.g.:
      // Estimate_Min__c: estimate_min,
      // Estimate_Max__c: estimate_max,
      // Service__c: service
    };

    const res = await fetch(`${API_DOMAIN}/crm/v2/Leads`, {
      method: 'POST',
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ data: [lead], trigger: ['workflow'] })
    });

    const text = await res.text();
    const ok = res.ok;

    return {
      statusCode: ok ? 200 : res.status,
      headers: corsHeaders(),
      body: ok ? JSON.stringify({ ok: true }) : text
    };
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

function safeStringify(obj) {
  try { return JSON.stringify(obj); } catch (_) { return '[unserializable]'; }
}