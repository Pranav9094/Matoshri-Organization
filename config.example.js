/* ═══════════════════════════════════════════════
   MATOSHREE ORGANISATION — Config EXAMPLE
   matoshriseva.org
   ═══════════════════════════════════════════════

   ✅ THIS FILE IS SAFE TO COMMIT TO GIT.
   ✅ It contains NO real secrets.

   SETUP INSTRUCTIONS:
     1. Copy this file and rename it to: config.js
     2. Replace YOUR_GOOGLE_DRIVE_API_KEY_HERE with
        your real API key from Google Cloud Console.
     3. config.js is listed in .gitignore and will
        never be committed automatically.

   GET YOUR API KEY:
     https://console.cloud.google.com/apis/credentials

   RESTRICT YOUR KEY (MANDATORY):
     Application Restriction → HTTP Referrers:
       matoshriseva.org/*
       www.matoshriseva.org/*
       localhost/*
     API Restriction → Google Drive API only
   ═══════════════════════════════════════════════ */

window.CONFIG = Object.freeze({

  GOOGLE_API_KEY: "YOUR_GOOGLE_DRIVE_API_KEY_HERE",

  /* Set DEBUG: true only on your local machine.
     Set DEBUG: false before pushing to production. */
  DEBUG: false

});
