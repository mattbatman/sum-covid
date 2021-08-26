import * as d3 from './d3-roll';
import lineChart from './line-chart';
import weeklyData from './data/weekly-flu-deaths.json';

function weeklyCharts() {
  const timeParser = d3.timeParse('%Y %U');
  const weeklyDeathsChart = lineChart();

  weeklyDeathsChart.init({
    sel: '#weekly-deaths-chart'
  });

  const newData = weeklyData.map((d) => {
    const weekStarting = timeParser(`${d.year} ${d.week}`);
    weekStarting.setDate(weekStarting.getDate() + 6);

    return {
      ...d,
      ['Covid 19 Deaths']: Number(d.COVID_19_deaths),
      ['Flu Deaths']: Number(d.influenza_deaths),
      ['Week Ending']: weekStarting
    };
  });

  weeklyDeathsChart.update({
    newData,
    yKey: 'Flu Deaths',
    xKey: 'Week Ending'
  });
}

export default weeklyCharts;
