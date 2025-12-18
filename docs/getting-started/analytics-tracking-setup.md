# Analytics & Tracking Setup

This guide explains how to configure analytics and tracking for **bmsventouse.fr** across the main platforms:

- Google Analytics 4 (GA4)
- Google Tag Manager (GTM)
- Google Search Console (GSC)
- Microsoft Clarity
- Optional: using GTM to add other tags (Google Ads, Meta Pixel, LinkedIn, etc.)

> The front‑end code is already wired. Your work is mainly in the Google / Clarity interfaces and in filling a few IDs.

---

## 1. Google Analytics 4 (GA4)

### 1.1. Property & data stream

1. Go to https://analytics.google.com  
2. Create (or reuse) a **GA4 property** for `bmsventouse.fr`.
3. In **Data streams** → create a **Web** stream with:
   - URL: `https://www.bmsventouse.fr`
   - Name: `BMS Ventouse`
4. Note the **Measurement ID** (format `G-XXXXXXX`).

The repo currently uses: `G-VCB3QB5P4L`.  
If you create a new property, replace that ID in the HTML.

### 1.2. Where GA4 is initialized in the code

On the main pages (home, services, contact, ventousage, sécurité, etc.) you already have:

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-VCB3QB5P4L"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('consent', 'default', {
    'ad_storage': 'denied',
    'ad_user_data': 'denied',
    'ad_personalization': 'denied',
    'analytics_storage': 'denied',
    'functionality_storage': 'denied',
    'security_storage': 'granted'
  });
  gtag('js', new Date());
  gtag('config', 'G-VCB3QB5P4L', { anonymize_ip: true });
</script>
```

To use your own GA4 property:

- Replace `G-VCB3QB5P4L` with your Measurement ID on all templates that include this snippet.

> Note: Consent Mode v2 is already configured. Analytics is “denied” by default and toggled via the cookie banner.

### 1.3. Events already tracked

`js/script.js` defines a helper `setupAnalyticsEvents()` and a lead capture for the contact form. Out of the box, the site sends:

- `phone_click`
  - Triggered on any `a[href^="tel:"]`
  - Parameters:
    - `event_category: "Contact"`
    - `event_label: href (tel:+33...)`

- `whatsapp_click`
  - Triggered on any `a[href*="wa.me"]`
  - Parameters:
    - `event_category: "Contact"`
    - `event_label: href (https://wa.me/...)`

- `email_click`
  - Triggered on any `a[href^="mailto:"]`
  - Parameters:
    - `event_category: "Contact"`
    - `event_label: href (mailto:contact@...)`

- `cta_contact_click`
  - Triggered on `a[href="/contact/"]`
  - Parameters:
    - `event_category: "CTA"`
    - `event_label: link text (button label)`

- `contact_submitted`
  - Triggered when the `/contact/` form is submitted.
  - Parameters (sent as a single object spread into the event):
    - `fullname`
    - `company`
    - `email`
    - `phone`
    - `service`
    - `location`
    - `urgency`
    - `details`
    - plus several service‑specific fields (e.g. `svc_ventousage_streets`, `svc_securite_agents`, etc.).
  - This event is also pushed to `dataLayer` for GTM:
    ```js
    window.dataLayer.push({ event: 'contact_submitted', ...payload });
    ```

### 1.4. Marking conversions in GA4

In GA4:

1. Go to **Admin → Events**.
2. Ensure that the events above appear (after some traffic).
3. In **Configure → Events**, mark as **conversion**:
   - `contact_submitted` (recommended main conversion).
   - Optionally: `phone_click`, `whatsapp_click`, `email_click`, `cta_contact_click`.

---

## 2. Google Tag Manager (GTM)

The codebase supports **GTM as an option**, without requiring it.

### 2.1. Create your GTM container

1. Go to https://tagmanager.google.com
2. Create a new **container**:
   - Name: `BMS Ventouse`
   - Target platform: Web
3. Note the **Container ID** (format `GTM-XXXXXXX`).

### 2.2. Connect the site to your GTM container

In the HTML templates (home, services, contact, ventousage, etc.), you already have:

```html
<meta name="gtm-id" content="">
```

And in `js/script.js`:

```js
function setupGTM() {
  try {
    const meta = document.querySelector('meta[name="gtm-id"]');
    const id = (meta && meta.content || (window.GTM_ID || '')).trim();
    if (!id) return;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
    const s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtm.js?id=' + encodeURIComponent(id);
    document.head.appendChild(s);
  } catch (e) {}
}
```

To enable GTM:

1. Edit the main templates (e.g. `index.html`, `services/index.html`, `contact/index.html`, etc.).
2. Set the GTM ID:

   ```html
   <meta name="gtm-id" content="GTM-ABCD123">
   ```

3. Deploy. The JS will automatically load the GTM container on all these pages.

> Because GA4 is already initialized directly in HTML, you can:
> - Either keep GA4 “as is” and use GTM only for extra tags (Google Ads, Meta, LinkedIn…).
> - Or move GA4 entirely into GTM (advanced). In that case, remove/adjust the direct `gtag` config to avoid double‑counting.

### 2.3. Using GTM to forward existing events

If you want GTM to send events (to Google Ads, Meta, etc.):

1. In GTM, create a **Custom Event** trigger for each event you care about:
   - Trigger type: `Custom Event`
   - Event name: `contact_submitted` (or `phone_click`, `whatsapp_click`, etc.)
2. Attach those triggers to the tags you configure:
   - GA4 event tags (if you move events to GTM).
   - Google Ads conversion tags.
   - Meta Pixel events, LinkedIn Insight, etc.

All the necessary data is already in `dataLayer` (the event name and payload for `contact_submitted`).

---

## 3. Google Search Console (GSC)

Even though this is not a “tag”, it is crucial for SEO monitoring.

### 3.1. Create and verify property

1. Go to https://search.google.com/search-console
2. Create a **Domain Property** or **URL prefix**:
   - Recommended: **Domain** → `bmsventouse.fr`
3. Verify ownership using DNS:
   - Add the TXT record provided by Google in your DNS (at your registrar).
   - Wait for validation.

### 3.2. Submit the sitemap

Once verified:

1. In GSC, go to your property.
2. In **Indexing → Sitemaps**, submit:
   - `https://www.bmsventouse.fr/sitemap.xml`

This ensures all your service / city / security pages are discovered and monitored.

---

## 4. Microsoft Clarity

Microsoft Clarity is already integrated, but privacy‑aware:

- The script is defined in `js/script.js` via `setupClarity()` and `loadClarityIfConsented()`.
- Clarity is loaded **only if** the user accepts analytics in the cookie banner or has previously consented.

If you want to change the Clarity project:

1. Go to https://clarity.microsoft.com and create a project for `bmsventouse.fr`.
2. Get the Clarity **project ID**.
3. In `js/script.js`, update the line inside `setupClarity()`:

   ```js
   // Example in script.js:
   (function(c,l,a,r,i,t,y){
     c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
     t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
     y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
   })(window, document, "clarity", "script", "tm9ex1xsa4");
   ```

   Replace `"tm9ex1xsa4"` with your new Clarity ID.

4. Deploy. Clarity will continue to respect the analytics consent.

---

## 5. Other tags (Google Ads, Meta Pixel, LinkedIn, etc.)

The recommended approach is to add those **via GTM**, not by editing HTML.

### 5.1. Google Ads conversion tags

In GTM:

1. Create a new tag:
   - Tag type: **Google Ads Conversion Tracking**.
   - Enter your Conversion ID and Conversion Label.
2. Trigger on relevant events, for example:
   - `contact_submitted` (Custom Event trigger) = lead form conversion.
3. Publish the container.

### 5.2. Meta Pixel (Facebook/Instagram)

1. In Meta Business Manager, create a Pixel and note the **Pixel ID**.
2. In GTM:
   - Add a custom HTML tag with the Meta Pixel snippet or use a community template.
   - Trigger on **All Pages** for base code, and on specific events (e.g. `contact_submitted`) if you want standard events (`Lead`, etc.).
3. Test with Meta’s Pixel Helper.

### 5.3. LinkedIn Insight Tag

1. In LinkedIn Campaign Manager, create an Insight Tag and get the JS snippet.
2. In GTM:
   - Create a new **Custom HTML** tag with the snippet.
   - Trigger on **All Pages**.
   - Optionally, create conversion rules in LinkedIn using URLs (e.g. `/contact/?success=1`) or use GTM custom events.

---

## 6. Summary Checklist

To fully activate tracking across platforms:

1. **GA4**
   - [ ] Property & web data stream created.
   - [ ] Measurement ID set in HTML (`gtag` snippet).
   - [ ] Events visible (`phone_click`, `whatsapp_click`, `email_click`, `cta_contact_click`, `contact_submitted`).
   - [ ] `contact_submitted` marked as conversion.

2. **GTM**
   - [ ] Container created (`GTM-XXXXXXX`).
   - [ ] `<meta name="gtm-id" content="GTM-XXXXXXX">` filled in main templates.
   - [ ] Optional: tags added (Google Ads, Meta, LinkedIn) with Custom Event triggers.

3. **Search Console**
   - [ ] Property created and verified (domain).
   - [ ] Sitemap submitted: `https://www.bmsventouse.fr/sitemap.xml`.

4. **Clarity**
   - [ ] Project created, ID swapped in `setupClarity()` if necessary.
   - [ ] Tested that Clarity only fires after cookie consent is accepted.

With this setup, you can follow:

- All key contact actions (phone, WhatsApp, email, contact form),
- Page performance (SEO + analytics),
- And add additional marketing pixels safely through GTM without touching the site code again.