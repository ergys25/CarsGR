const { scrapeAllCarDetails } = require('./scrapers/carScraper');
const { log } = require('./utils/logger');

(async () => {
  try {
    log('🚀 Starting Car.gr Full Scraper');
    await scrapeAllCarDetails();
    log('✅ Scraper completed successfully');
  } catch (error) {
    log(`❌ Fatal Error: ${error.message}`, 'FATAL');
  }
})();
