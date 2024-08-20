import createRatesByAgeTable from './create-rates-by-age';
import createDeathsByMedcondChart from './create-deaths-by-medcond';
import smoothScrollArrow from './scroll-arrow';
import daily from './daily-deaths-cases';
import weekly from './weekly-flu';
import causes from './select-causes-of-death';
import vaersEvent from './vaers-event-chart';
import obesity from './obesity';
import countData from './data/combined-by-age.json';

import './index.scss';

function main() {
  smoothScrollArrow();
  createRatesByAgeTable(countData);
  createDeathsByMedcondChart();
  daily();
  weekly();
  causes();
  vaersEvent('Death', '#vaers-deaths-by-year', 55);
  vaersEvent('Permanent Disability', '#vaers-disability-by-year', 55);
  vaersEvent('Hospitalized', '#vaers-hospitalizations-by-year', 55);
  obesity();
}

main();
