const { log } = require('./logger');

function handleError(error, context = '') {
  log(`Error: ${error.message || error}`, 'ERROR');
  if (context) log(`Context: ${context}`, 'ERROR');
}

module.exports = { handleError };
