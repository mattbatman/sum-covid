import * as Plot from '@observablehq/plot';
import { concat, map, keys, forEach } from 'ramda';

function obesity() {
  const mainChartContainer = document.querySelector('#weight-chart');
  const percentChartContainer = document.querySelector(
    '#weight-percentage-chart'
  );

  const data = [
    {
      bmi: 'Underweight',
      result: 'Positive Test',
      cases: 2674
    },
    {
      bmi: 'Underweight',
      result: 'Hospitalized',
      cases: 1730
    },
    {
      bmi: 'Underweight',
      result: 'Death',
      cases: 273
    },
    {
      bmi: 'Healthy Weight',
      result: 'Positive Test',
      cases: 28349
    },
    {
      bmi: 'Healthy Weight',
      result: 'Hospitalized',
      cases: 14111
    },
    {
      bmi: 'Healthy Weight',
      result: 'Death',
      cases: 1957
    },
    {
      bmi: 'Overweight',
      result: 'Positive Test',
      cases: 41973
    },
    {
      bmi: 'Overweight',
      result: 'Hospitalized',
      cases: 19847
    },
    {
      bmi: 'Overweight',
      result: 'Death',
      cases: 2277
    },
    {
      bmi: 'Obesity',
      result: 'Positive Test',
      cases: 34608 + 20262
    },
    {
      bmi: 'Obesity',
      result: 'Hospitalized',
      cases: 16338 + 9476
    },
    {
      bmi: 'Obesity',
      result: 'Death',
      cases: 1830 + 960
    },
    {
      bmi: 'Severe Obesity',
      result: 'Positive Test',
      cases: 10739 + 9889
    },
    {
      bmi: 'Severe Obesity',
      result: 'Hospitalized',
      cases: 5015 + 4974
    },
    {
      bmi: 'Severe Obesity',
      result: 'Death',
      cases: 517 + 534
    }
  ];

  const totalResults = {
    'Positive Test': 148494,
    Hospitalized: 71491,
    Death: 8348
  };

  const totalsByClass = {
    Underweight: 79988,
    'Healthy Weight': 829474,
    Overweight: 936132,
    Obesity: 674575 + 373226,
    'Severe Obesity': 187046 + 162208
  };

  const dataAsPercents = getDataAsPercents(data, totalResults, totalsByClass);

  if (mainChartContainer) {
    generateWeightChart({ data, container: mainChartContainer });
  }

  if (percentChartContainer && dataAsPercents) {
    generateWeightPercentChart({
      data: dataAsPercents,
      container: percentChartContainer
    });
  }
}

const getDataAsPercents = (data, totalResults, totalsByClass) => {
  const totalDatabase = 3242649;

  const casesAsPercents = map(
    (d) => ({
      ...d,
      cases: d.cases / totalResults[d.result]
    }),
    data
  );

  const classes = keys(totalsByClass);

  forEach((k) => {
    classTotal = totalsByClass[k];
    totalsByClass[k] = classTotal / totalDatabase;
  }, classes);

  const percentsSegment = map(
    (k) => ({
      bmi: k,
      result: 'Total Cohort in Database',
      cases: totalsByClass[k]
    }),
    classes
  );

  return concat(percentsSegment, casesAsPercents);
};

function generateWeightChart({ data, container }) {
  const plotOptions = {
    marginLeft: 90,
    marginBottom: 50,
    width: 768,
    height: 425,
    style: {
      backgroundColor: '#f8eedc',
      fontFamily: 'Inter, sans-serif'
    },
    x: {
      label: 'Patients with COVID-19 →',
      grid: true
    },
    y: {
      label: 'Outcome'
    },
    fy: {
      domain: data.map(({ bmi }) => bmi),
      label: 'BMI Classification'
    },
    facet: {
      data,
      y: 'bmi',
      marginRight: 100
    },
    marks: [
      Plot.barX(
        data,
        Plot.groupY(
          { x: 'sum' },
          {
            x: 'cases',
            y: 'result',
            title: (group) =>
              `BMI Classification: ${group[0].bmi}\n${group[0].result}: ${group[0].cases}`,
            sort: { y: 'x', reverse: true }
          }
        )
      ),
      Plot.ruleX[0]
    ]
  };

  const chart = Plot.plot(plotOptions);

  if (chart) {
    container.appendChild(chart);
  }
}

function generateWeightPercentChart({ data, container }) {
  const plotOptions = {
    marginLeft: 120,
    marginBottom: 50,
    width: 768,
    height: 450,
    style: {
      backgroundColor: '#f8eedc',
      fontFamily: 'Inter, sans-serif'
    },
    x: {
      label: 'Percent of Outcome →',
      grid: true,
      tickFormat: '%'
    },
    y: {
      label: null,
      tickRotate: -23,
      domain: ['Total Cohort in Database', 'Positive Test', 'Hospitalized', 'Death']
    },
    fy: {
      domain: data.map(({ bmi }) => bmi),
      label: 'BMI Classification'
    },
    facet: {
      data,
      y: 'bmi',
      marginRight: 100
    },
    marks: [
      Plot.barX(
        data,
        Plot.groupY(
          { x: 'sum' },
          {
            x: 'cases',
            y: 'result',
            title: (group) =>
              `BMI Classification: ${group[0].bmi}\n${
                group[0].result
              }: ${Math.round(group[0].cases * 100)}%`
          }
        )
      ),
      Plot.ruleX[0]
    ]
  };

  const chart = Plot.plot(plotOptions);

  if (chart) {
    container.appendChild(chart);
  }
}

export default obesity;
