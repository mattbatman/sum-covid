import barChart from './bar-chart';
import { sort, filter, pipe, map } from 'ramda';
import rawDeaths from './data/vaccine-deaths.json';

function vaersDeathsByYear() {
  const deathsChart = barChart();
  const filterAndSort = pipe(
    (data) => filter((d) => d.year_reported !== 'Unknown Date', data),
    (data) =>
      map(
        (d) => ({
          ...d,
          Year: d.year_reported,
          Deaths: Number(d.events_reported)
        }),
        data
      ),
    (data) => sort((a, b) => a.Year - b.Year, data)
  );

  deathsChart.init({
    sel: '#vaers-deaths-by-year',
    newMargin: {
      top: 0,
      right: 0,
      bottom: 50,
      left: 55
    }
  });

  const data = filterAndSort(rawDeaths);

  deathsChart.update({
    newData: data,
    yKey: 'Deaths',
    xKey: 'Year',
    useTimeTicks: false,
    rectColorFunction: (d) => '#ffffff'
  });
}

export default vaersDeathsByYear;
