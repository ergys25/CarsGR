const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const { log } = require('../utils/logger');
const { handleError } = require('../utils/errorHandler');
const config = require('../../config/scraperConfig');

/**
 * Scrapes car details across all pages and listings dynamically.
 */
async function scrapeAllCarDetails() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  let carDetailsList = [];
  let pageNumber = 1;

  try {
    await page.goto(config.baseUrl, { timeout: config.timeout });
    log(`🌍 Starting from: ${config.baseUrl}`);

    while (true) {
      log(`📄 Scraping Page ${pageNumber}`);

      // Wait for car listing links to load
      await page.waitForSelector(config.listingSelector, { timeout: config.timeout });

      // Extract all car links on the current page
      const links = await page.$$eval(config.listingSelector, (anchors) =>
        anchors.map(anchor => anchor.href)
      );

      log(`🔗 Found ${links.length} car links on page ${pageNumber}`);

      for (const [index, link] of links.entries()) {
        let retries = config.maxRetries;
        while (retries > 0) {
          try {
            log(`🚗 Visiting car listing ${index + 1}/${links.length}: ${link}`);
            await page.goto(link, { timeout: config.timeout });
            await page.waitForSelector('#specification-table', { timeout: config.timeout });

            // Extract car details from the specification table
            const carDetails = await page.$$eval('#specification-table tr', (rows) => {
              const data = {};
              rows.forEach(row => {
                const key = row.querySelector('td:nth-child(1)')?.innerText.trim();
                const value = row.querySelector('td:nth-child(2)')?.innerText.trim();
                if (key && value) {
                  data[key] = value;
                }
              });
              return data;
            });

            carDetails['Listing Link'] = link;
            carDetailsList.push(carDetails);
            log(`✅ Successfully scraped details for ${link}`);

            break; // Exit retry loop if successful
          } catch (error) {
            retries--;
            handleError(error, `Retrying ${link}. Attempts left: ${retries}`);
            if (retries === 0) {
              log(`❌ Failed to scrape details from ${link} after maximum retries`, 'ERROR');
            }
          }
        }
      }

      // Check for 'Next' button to continue pagination

      if (true) {
          console.log('➡️ Clicking the Next button using XPath...');
          pageNumber++;
          link = `https://www.car.gr/classifieds/cars/?category=15001&crashed=f&fuel_type=1&fuel_type=2&location2=3&offer_type=sale&pg=${pageNumber}&price-from=2000&price-to=5000&st=3`
          await page.goto(link, { timeout: config.timeout });
      } else {
          console.log('🏁 No more pages found. Scraping complete.');
          break;
      }

    }

    // Save all car details to a JSON file
    const outputFilePath = path.resolve(config.outputDetailsFile);
    fs.writeFileSync(outputFilePath, JSON.stringify(carDetailsList, null, 2));
    log(`📄 All car details saved to: ${outputFilePath}`);
  } catch (error) {
    handleError(error, 'Fatal error during scraping');
  } finally {
    await browser.close();
    log('🛑 Browser closed');
  }
}

module.exports = { scrapeAllCarDetails };
