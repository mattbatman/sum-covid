import * as d3 from './d3-roll';
import lineChart from './line-chart';
import weeklyData from './data/weekly-flu-deaths.json';

function weeklyCharts() {
  const timeParser = d3.timeParse('%Y %U');
  const fluDeathsChart = lineChart();
  const combinedDeathsChart = lineChart();

  fluDeathsChart.init({
    sel: '#weekly-flu-deaths-chart'
  });

  combinedDeathsChart.init({
    sel: '#weekly-combined-deaths-chart'
  });

  const multiLineData = {
    y: 'Weekly Deaths',
    series: [
      {
        name: 'Flu Deaths',
        color: '#fdba3a',
        values: weeklyData.map((d) => Number(d.influenza_deaths))
      },
      {
        name: 'COVID 19 Deaths',
        color: '#1b5037',
        values: weeklyData.map((d) => Number(d.COVID_19_deaths))
      }
    ],
    dates: weeklyData.map((d) => {
      const weekStarting = timeParser(`${d.year} ${d.week}`);
      weekStarting.setDate(weekStarting.getDate() + 6);

      return weekStarting;
    })
  };

  combinedDeathsChart.update({
    newData: multiLineData,
    yKey: 'Flu Deaths',
    xKey: 'Week Ending'
  });

  combinedDeathsChart.createLegend({
    legendSelector: '#weekly-combined-deaths-legend'
  });

  const singleLineData = {
    ...multiLineData,
    series: multiLineData.series.filter((d) => d.name === 'Flu Deaths')
  };

  fluDeathsChart.update({
    newData: singleLineData,
    yKey: 'Flu Deaths',
    xKey: 'Week Ending'
  });
}

export default weeklyCharts;
