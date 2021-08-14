import { reverse, map, pipe } from 'ramda';
import * as d3 from './d3-roll';

const addRates = (data) =>
  map((d) => {
    const deathRate = d.deaths / d.cases;

    return {
      ...d,
      death_rate: deathRate,
      survival_rate: 1 - deathRate
    };
  }, data);

const getRatesData = pipe(addRates, reverse);

function createRatesByAgeTable(combinedCountData) {
  const ratesByAge = getRatesData(combinedCountData);

  const columns = [
    'Age Group',
    'Death Rate',
    'Survival Rate',
    'Deaths',
    'Cases'
  ];

  const columnsMap = {
    'Age Group': 'age_group',
    'Death Rate': 'death_rate',
    'Survival Rate': 'survival_rate',
    Deaths: 'deaths',
    Cases: 'cases'
  };

  const format = (columnHeader, data) => {
    if (columnHeader === 'Death Rate' || columnHeader === 'Survival Rate') {
      return d3.format('.3%')(data);
    }

    if (columnHeader === 'Cases' || columnHeader === 'Deaths') {
      return parseInt(data).toLocaleString('en');
    }

    return data;
  };

  const tableContainer = d3.select('.death-rates-by-age-table-container');

  const table = tableContainer.append('table');
  const tableBody = table.append('tbody');

  const tableHeader = table
    .append('thead')
    .append('tr')
    .selectAll('th')
    .data(columns)
    .enter()
    .append('th')
    .text((columnHeader) => columnHeader);

  const tableRows = tableBody
    .selectAll('tr')
    .data(ratesByAge)
    .enter()
    .append('tr');

  // create a cell in each row for each column
  const tableCells = tableRows
    .selectAll('td')
    .data((row) =>
      columns.map((column) => ({
        column: column,
        value: format(column, row[columnsMap[column]])
      }))
    )
    .enter()
    .append('td')
    .text((d) => d.value);
}

export default createRatesByAgeTable;
