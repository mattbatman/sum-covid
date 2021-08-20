import barChart from './bar-chart';
import { timeScale } from './custom-scales';
import dailyDeathsData from './data/daily-deaths.json';
import dailyCasesData from './data/daily-cases.json';

function dailyDeathsCases() {
  const dailyDeathsChart = barChart();

  dailyDeathsChart.init({
    sel: '#daily-deaths-chart',
    newMargin: {
      top: 0,
      right: 0,
      bottom: 200,
      left: 44
    }
  });

  const newData = dailyDeathsData.map((d) => ({
    ...d,
    Date: d.date,
    Deaths: Number(d['new_deaths'])
  }));

  dailyDeathsChart.update({
    newData,
    yKey: 'Deaths',
    xKey: 'Date',
    useTimeTicks: true,
    rectColorFunction: (d) => '#ffffff'
  });
}

export default dailyDeathsCases;
