import * as Plot from '@observablehq/plot';
import * as d3 from './d3-roll';

// https://github.com/observablehq/plot#marks
// https://observablehq.com/@observablehq/plot-marks
// https://observablehq.com/@observablehq/plot-group?collection=@observablehq/plot
function obesity() {
  const chartContainer = document.querySelector('#weight-chart');

  if (chartContainer) {
    const data = [
      {
        bmi: 'Underweight',
        result: 'Cases',
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
        result: 'Cases',
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
        result: 'Cases',
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
        result: 'Cases',
        cases: 75498 + 34608 + 20262
      },
      {
        bmi: 'Obesity',
        result: 'Hospitalized',
        cases: 35803 + 16338 + 9476
      },
      {
        bmi: 'Obesity',
        result: 'Death',
        cases: 3841 + 1830 + 960
      },
      {
        bmi: 'Severe Obesity',
        result: 'Cases',
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

    const plotOptions = {
      marginLeft: 90,
      marginBottom: 50,
      width: 768,
      height: 400,
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

    chartContainer.appendChild(chart);
  }
}

export default obesity;
