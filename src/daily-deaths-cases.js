import barChart from './bar-chart';
import dailyDeathsData from './data/daily-deaths.json';
import dailyCasesData from './data/daily-cases.json';

function dailyDeathsCases() {
  const dailyDeathsChart = barChart();
  const dailyCasesChart = barChart();

  dailyDeathsChart.init({
    sel: '#daily-deaths-chart',
    newMargin: {
      top: 0,
      right: 0,
      bottom: 50,
      left: 60
    }
  });

  dailyCasesChart.init({
    sel: '#daily-cases-chart',
    newMargin: {
      top: 0,
      right: 0,
      bottom: 50,
      left: 60
    }
  });

  const deathsChartData = dailyDeathsData.map((d) => ({
    ...d,
    Date: d.date,
    Deaths: Number(d['new_deaths'])
  }));

  const casesChartData = dailyCasesData.map((d) => ({
    ...d,
    Date: d.date,
    Cases: Number(d['new_cases'])
  }));

  dailyDeathsChart.update({
    newData: deathsChartData,
    yKey: 'Deaths',
    xKey: 'Date',
    useTimeTicks: true,
    rectColorFunction: (d) => '#ffffff'
  });

  dailyCasesChart.update({
    newData: casesChartData,
    yKey: 'Cases',
    xKey: 'Date',
    useTimeTicks: true,
    rectColorFunction: (d) => '#ffffff'
  });
}

export default dailyDeathsCases;
