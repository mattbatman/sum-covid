import barChart from './bar-chart';
import { sort, filter, pipe, map } from 'ramda';
import rawData from './data/all-vaccine-events.json';

function vaersEvent(eventCategory, selector, leftMargin = 45) {
  const chart = barChart();
  const filterAndSort = pipe(
          (data) => filter((d) => d.event_category === eventCategory, data),
          (data) => filter((d) => d.year_reported !== 'Unknown Date', data),
          (data) =>
            map(
              (d) => ({
                ...d,
                Year: d.year_reported,
                [eventCategory]: Number(d.events_reported)
              }),
              data
            ),
          (data) => sort((a, b) => a.Year - b.Year, data),
          (data) => filter((d) => d.Year >= 1990, data)
        );

  chart.init({
    sel: selector,
    newMargin: {
      top: 0,
      right: 0,
      bottom: 50,
      left: leftMargin
    }
  });

  const data = filterAndSort(rawData);

  chart.update({
    newData: data,
    yKey: eventCategory,
    xKey: 'Year',
    useTimeTicks: false,
    rectColorFunction: (d) => '#ffffff'
  });
}

export default vaersEvent;
