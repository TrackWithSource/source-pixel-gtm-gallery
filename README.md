# Source Pixel

## Overview

Source provides a Google Tag Manager (GTM) gallery tag for easy install for GTM users, and for users using a compatible Cookie Consent Management Platforms (CMP)

## Install Instructions

Install Source tag from Google Tag Manager Gallery

## Adding Permissions

When you install the tag from the gallery (or import [template.tpl](template.tpl)), all required permissions are already declared — GTM will simply ask you to review and accept them.

If you are building the template manually by pasting [raw-code.js](raw-code.js) into a new Custom Template:

1. In GTM, go to **Templates → Tag Templates → New**.
2. Paste the contents of `raw-code.js` into the **Code** tab. GTM detects the sandboxed APIs used and lists the required permissions.
3. Open the **Permissions** tab and configure each entry:

| Permission | Configuration |
| --- | --- |
| Injects scripts | Allowed URL match pattern: `https://pixel.source.app/*` |
| Accesses global variables | `sourcePixel`: read, write, execute. `sourcePixelGtmLoaded`: read, write, execute |
| Accesses consent state | `analytics_storage`: read and write |
| Logs to console | Only while debugging / previewing |
| Reads container data | No configuration needed |

4. Save the template. It is now available under **Tags → New → Custom** in your container.

The *Injects scripts* pattern must match the pixel URL configured at the top of the code — if you point `PIXEL_URL` somewhere else (e.g. a self-hosted copy), update the URL pattern to match or the tag will fail with an `injectScript` permission error.

## Cookie Consent Management Platform Instructions

_IMPORTANT_ - You must read the instructions from your CMP prior to using the Source Gallery Tag.

For users that require cookie consent, Source is able to hold cookie and tracking calls in memory, and only execute them if the user grants consent in your CMP.

Users that accepted consent will be remembered for the next time they visit, so they won't need to accept again.

Users that decline will not be remembered, but Source will not write any cookies or tracking events until they approve.

### Google Consent Mode

If your CMP is compatible with Google Consent Mode, they will usually have their own tag that configures the integration between the Source pixel and the CMP.  Install this, and verify the Source cookies install only after granting permission.

### Manual Consent Integration

Source provides a callback that can be used to execute or clear any pending cookies or event tracking.

```javascript
// Execute this callback if the user provides consent
// in your CMP
sourcePixel('consent', true)

// Execute this callback if the user declines consent
// in your CMP
sourcePixel('consent', false)
```