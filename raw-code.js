/**
 * ENV CONFIG
 */
// const PIXEL_URL = 'https://local.devsourceapp.com/dist/sourcepixel.min.js';
const PIXEL_URL = 'https://pixel.source.app/versions/3/sourcepixel.min.js';
/**
 * END CONFIG
 */


const injectScript = require('injectScript');
const callInWindow = require('callInWindow');
const copyFromWindow = require('copyFromWindow');
const setInWindow = require('setInWindow');
const isConsentGranted = require('isConsentGranted');
const addConsentListener = require('addConsentListener');
const logToConsole = require('logToConsole');
const getContainerVersion = require('getContainerVersion');

const container = getContainerVersion();
const DEBUG = !!(container.debugMode || container.previewMode);
const log = (msg) => { if (DEBUG) logToConsole('[SourcePixel] ' + msg); };

const CACHE_TOKEN = 'sourcePixel_v3';
const CONSENT_TYPE = 'analytics_storage';
const GUARD = 'sourcePixelGtmLoaded';

// Logger only fires in DEBUG mode
log('Tag fired. websiteId=' + data.websiteId +
    ' isConsentGranted(CONSENT_TYPE)=' + isConsentGranted(CONSENT_TYPE));

// Block duplicate invocations
if (copyFromWindow(GUARD)) {
  log('Already initialized on this page; skipping.');
  data.gtmOnSuccess();
} else {
  setInWindow(GUARD, true, true);

  // We need to track if the pixel has been loaded, so that
  // we can either set or queue any consent
  let pixelLoaded = false;
  let pendingConsent = null;

  // The apply consent function handles the pendingConsent
  // case where the user clicks prior to the Source pixel
  // being loaded
  const applyConsent = (granted) => {
    if (pixelLoaded) {
      log('Sending consent=' + granted);
      callInWindow('sourcePixel', 'consent', granted);
    } else {
      log('Consent=' + granted + ' arrived pre-load; buffering.');
      pendingConsent = granted;
    }
  };

  // Handle any consent approval/denial events from the CMP
  addConsentListener(CONSENT_TYPE, (consentType, granted) => {
    log('Consent update: ' + consentType + '=' + granted);
    applyConsent(granted);
  });

  log('Injecting ' + PIXEL_URL);

  injectScript(PIXEL_URL, () => {
    // Validate script loaded correctly
    if (!copyFromWindow('sourcePixel')) {
      log('ERROR: script loaded but window.sourcePixel is undefined.');
      data.gtmOnFailure();
      return;
    }
    
    // Flag the script as loaded so that we will stop queueing any 
    // consent values
    pixelLoaded = true;
    
    // Grab the initial consent setting sent from Google Tag Manager, this
    // comes based off tag settings, not an event from the CMP.  If we somehow
    // get a CMP event prior to getting here, then that take priority.
    const defaultGtmGrantedStatus = isConsentGranted(CONSENT_TYPE) && pendingConsent !== false;

    // Set the default consent requirement based on the GTM setting.  
    // Note: If the pixel sees a cookie already set, it will override this setting
    // with a consent granted value.  This is because some CMPs don't send an 
    // approved/denied value for returning visitors, so we can safely assume nothing
    // has changed since the last visit.  An explicit deny will override this
    // and delete the cookie.
    callInWindow('sourcePixel', 'init', data.websiteId, { 
      // If consent is not granted (false), then the consent requirement is true
      requireConsent: !defaultGtmGrantedStatus 
    });
    callInWindow('sourcePixel', 'event', 'pageload');

    // Try to pull any pending consent values, they take priority if we got
    // something, then update the pixel
    if (pendingConsent !== null) {
      log('Applying consent=(buffered) ' + pendingConsent);
      callInWindow('sourcePixel', 'consent', pendingConsent);
    }

    data.gtmOnSuccess();
  }, () => {
    log('ERROR: injectScript failed. Check inject_script permission matches ' + PIXEL_URL);
    data.gtmOnFailure();
  }, CACHE_TOKEN);
}