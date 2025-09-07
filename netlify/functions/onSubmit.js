exports.handler = async function(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }
  const data = JSON.parse(event.body || "{}");
  // Example: forward to Zapier webhook
  const zapierURL = process.env.ZAPIER_WEBHOOK_URL;
  if (!zapierURL) return { statusCode: 500, body: "No webhook configured" };
  const fetch = require('node-fetch');
  const resp = await fetch(zapierURL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return {
    statusCode: resp.ok ? 200 : 500,
    body: resp.ok ? "OK" : "Error forwarding to CRM"
  };
};