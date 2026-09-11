# Source Pixel

## Overview

Source provides a Google Tag Manager (GTM) gallery tag for easy install for GTM users, and for users using a compatible Cookie Consent Management Platforms (CMP)

## Install Instructions

Install Source tag from Google Tag Manager Gallery

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
sourcePixel('consent', true)
```