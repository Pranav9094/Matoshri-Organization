const fs = require('fs');

const configContent = `window.CONFIG = Object.freeze({
  GOOGLE_API_KEY: "${process.env.GOOGLE_API_KEY}",
  DEBUG: false
});`;

fs.writeFileSync('config.js', configContent);
console.log('config.js generated successfully');