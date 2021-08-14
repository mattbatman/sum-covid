import createRatesByAgeTable from './create-rates-by-age';
import smoothScrollArrow from './scroll-arrow';
import countData from './data/combined-by-age.json';

function main() {
  smoothScrollArrow();
  createRatesByAgeTable(countData);
}

main();
