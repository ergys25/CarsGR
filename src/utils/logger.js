const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, '../../logs/scraper.log');

function log(message, level = 'INFO') {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${level}] ${message}\n`;
  fs.appendFileSync(logFilePath, logMessage);
  console.log(logMessage);
}

module.exports = { log };
