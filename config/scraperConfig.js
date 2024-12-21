require('dotenv').config();

module.exports = {
  baseUrl: 'https://www.car.gr/classifieds/cars/?category=15001&crashed=f&fuel_type=1&fuel_type=2&location2=3&offer_type=sale&pg=1&price-from=2000&price-to=5000&st=3',
  timeout: 60000,
  maxRetries: 3,
  outputDetailsFile: './data/car_details.json',
  paginationSelector: 'a[href*="pg="] svg.ci-chevron-right',
  listingSelector: 'a.row-anchor' // Selector for individual car links
};
