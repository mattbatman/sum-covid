import { sortBy, prop } from 'ramda';
import barChart from './bar-chart';
import deathsByMedcondData from './data/deaths-by-medcond.json';

function createDeathsByMedcondChart() {
  const getOrder = (k) => {
    orderMap = {
      No: 1,
      Yes: 2,
      Unknown: 4,
      Missing: 3
    }

    return orderMap[k]
  }

  const deathsMedcond = barChart();

  const dataWithKeysSortOrder =  deathsByMedcondData.map(({ count, medcond_yn }) => ({
      Deaths: Number(count),
      'Has Underlying Medical Condition': medcond_yn
  }))
    .map(d => ({
    ...d,
      order: getOrder(d['Has Underlying Medical Condition'])
  }))
  
  const newData = sortBy(prop('order'),dataWithKeysSortOrder)

  deathsMedcond.init({
    sel: '#deaths-medcond-chart',
    newMargin: { top: 10, right: 0, bottom: 40, left: 60 }
  });

  deathsMedcond.update({
    newData,
    yKey: 'Deaths',
    xKey: 'Has Underlying Medical Condition',
    rectColorFunction: (d) => '#000000'
  });
}

export default createDeathsByMedcondChart;
