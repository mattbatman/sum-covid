import createRatesByAgeTable from './create-rates-by-age';
import createDeathsByMedcondChart from './create-deaths-by-medcond';
import smoothScrollArrow from './scroll-arrow';
import daily from './daily-deaths-cases';
import weekly from './weekly-flu';
import causes from './select-causes-of-death';
import vaersDeathsByYear from './vaers-deaths-by-year';
import vaersEvent from './vaers-event-chart';
import countData from './data/combined-by-age.json';

function main() {
  smoothScrollArrow();
  createRatesByAgeTable(countData);
  createDeathsByMedcondChart();
  daily();
  weekly();
  causes();
  vaersDeathsByYear();
  vaersEvent('Permanent Disability', '#vaers-disability-by-year');
  vaersEvent('Hospitalized', '#vaers-hospitalizations-by-year', 55);
}

main();
