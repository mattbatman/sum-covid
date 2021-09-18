import createRatesByAgeTable from './create-rates-by-age';
import createDeathsByMedcondChart from './create-deaths-by-medcond';
import smoothScrollArrow from './scroll-arrow';
import daily from './daily-deaths-cases';
import weekly from './weekly-flu';
import causes from './select-causes-of-death';
import countData from './data/combined-by-age.json';

function main() {
  smoothScrollArrow();
  createRatesByAgeTable(countData);
  createDeathsByMedcondChart();
  daily();
  weekly();
  causes();
}

main();
