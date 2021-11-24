import * as d3 from './d3-roll';
import * as R from 'ramda';

const BarChart = () => {
  let data = [];
  // set selector of container div
  let selector = '';
  // set margin
  let margin = { top: 60, right: 0, bottom: 90, left: 30 };
  // width and height of chart
  let width;
  let height;
  // skeleton of the chart
  let svg;
  // scales
  let xScale;
  let yScale;
  // axes
  let xAxis;
  let yAxis;
  let xk;
  let yk;
  // bars
  let rect;
  // chart title
  let title = '';
  // tooltip
  let tooltip;
  let tipBody;
  const parseTime = d3.timeParse('%b %e %Y');

  function init({ sel, xTitle, chartTitle, subtitle, newMargin }) {
    selector = sel;
    title = chartTitle;
    if (newMargin) {
      margin = newMargin;
    }
    // get size of container
    width =
      parseInt(d3.select(selector).style('width')) - margin.left - margin.right;
    height =
      parseInt(d3.select(selector).style('height')) -
      margin.top -
      margin.bottom;
    // create the skeleton of the chart
    svg = d3
      .select(selector)
      .append('svg')
      .attr('width', '100%')
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

    svg
      .append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0, ${height})`);

    svg.append('g').attr('class', 'y axis');

    svg
      .append('g')
      .attr('class', 'x label')
      .attr('transform', `translate(10, 20)`)
      .append('text')
      .text(xTitle);

    // call resize
    d3.select(window).on(`resize.${selector}`, resize);

    // add a chart title
    if (chartTitle) {
      svg
        .append('text')
        .attr('class', 'title')
        .attr('x', width / 2)
        .attr('y', 0 - margin.top / 2)
        .text(title)
        .style('text-anchor', 'middle');
    }
    // add a subtitle
    if (subtitle) {
      svg
        .append('text')
        .attr('class', 'subtitle')
        .attr('x', width / 2)
        .attr('y', 0 - margin.top / 2 + 25)
        .text(subtitle)
        .style('text-anchor', 'middle');
    }

    // rotate axis text
    svg
      .select('.x.axis')
      .selectAll('text')
      .attr('transform', 'rotate(45)')
      .style('text-anchor', 'start');

    if (parseInt(width) >= 600) {
      // level axis text
      svg
        .select('.x.axis')
        .selectAll('text')
        .attr('transform', 'rotate(0)')
        .style('text-anchor', 'middle');
    }

    tooltip = d3
      .select(selector)
      .append('table')
      .attr('class', 'hidden d3-tooltip');

    tipBody = tooltip.append('tbody');

    tipBody.append('tr').append('td').attr('class', 'stat');
  }

  function update({
    newData,
    xKey,
    yKey,
    overrideYMax,
    rectColorFunction,
    timeXScale,
    useTimeTicks,
    timeTicksAreYear
  }) {
    data = newData;
    xk = xKey;
    yk = yKey;

    xScale = timeXScale ? timeXScale : d3.scaleBand().padding(0.05);
    xAxis = d3.axisBottom(xScale);
    yScale = d3.scaleLinear();
    yAxis = d3.axisLeft(yScale);

    xScale.domain(data.map((d) => d[xk])).range([0, width]);

    const yMax = overrideYMax
      ? overrideYMax
      : d3.max(R.map((d) => d[yk], data));

    yScale.domain([0, yMax]).range([height, 0]);

    if (useTimeTicks) {
      const filterFunction = timeTicksAreYear
        ? filterTimeTicksOnlyYear
        : filterTimeTicksFullDate;
      xAxis.tickValues(xScale.domain().filter(filterFunction));
    }

    xAxis.scale(xScale);

    yAxis.scale(yScale);

    rect = svg.selectAll('rect').data(data);

    rect
      .join('rect')
      .style('fill', rectColorFunction)
      .attr('y', (d) => yScale(d[yk]))
      .attr('height', (d) => height - yScale(d[yk]))
      .attr('x', (d) => xScale(d[xk]))
      .attr('width', xScale.bandwidth())
      .on('mouseover', updateTooltip)
      .on('mouseout', (event, d) => {
        d3.select(`${selector} .d3-tooltip`).classed('hidden', true);
      });

    // call the axes
    svg.select('.x.axis').call(xAxis);

    svg.select('.y.axis').call(yAxis);
  }

  function updateTooltip(event, d) {
    d3.select(`${selector} .d3-tooltip .stat`).text(
      `${d[xk]}: ${d[yk].toLocaleString()}`
    );
    d3.select(`${selector} .d3-tooltip`)
      .classed('hidden', false)
      .style('left', () => {
        if (
          parseInt(
            `${
              event.pageX +
              0.5 *
                parseInt(d3.select(`${selector} .d3-tooltip`).style('width'))
            }`
          ) > parseInt(`${parseInt(d3.select('body').style('width'))}`)
        ) {
          return `${
            event.pageX -
            parseInt(d3.select(`${selector} .d3-tooltip`).style('width'))
          }px`;
        }
        if (
          parseInt(
            `${
              event.pageX -
              0.5 *
                parseInt(d3.select(`${selector} .d3-tooltip`).style('width'))
            }`
          ) < 0
        ) {
          return `${event.pageX}px`;
        }
        return `${
          event.pageX -
          0.5 * parseInt(d3.select(`${selector} .d3-tooltip`).style('width'))
        }px`;
      })
      .style(
        'top',
        `${
          event.pageY -
          parseInt(d3.select(`${selector} .d3-tooltip`).style('height')) -
          7
        }px`
      );
  }

  function filterTimeTicksFullDate(d) {
    const parsed = parseTime(d);
    const date = parsed.getDate();
    const monthMinusOne = parsed.getMonth();
    if (date === 1) {
      if (
        monthMinusOne === 0 ||
        monthMinusOne === 6 ||
        monthMinusOne === 3 ||
        monthMinusOne === 9
      ) {
        return true;
      }
    }

    return false;
  }

  function filterTimeTicksOnlyYear(d, i, a) {
    return i % 5 === 0;
  }

  function resize(event) {
    // get size of container
    width =
      parseInt(d3.select(selector).style('width')) - margin.left - margin.right;
    height =
      parseInt(d3.select(selector).style('height')) -
      margin.top -
      margin.bottom;
    // reset ranges based on new width and height
    xScale.range([0, width]);
    yScale.range([height, 0]);
    // reset the axes
    xAxis.scale(xScale);
    yAxis.scale(yScale);
    // call the axes
    svg.select('.x.axis').call(xAxis);
    svg.select('.y.axis').call(yAxis);
    // reset the size of the bars
    svg
      .selectAll('rect')
      .attr('y', (d) => yScale(d[yk]))
      .attr('height', (d) => height - yScale(d[yk]))
      .attr('x', (d) => xScale(d[xk]))
      .attr('width', xScale.bandwidth());
    // move title location
    svg
      .select('.title')
      .attr('x', width / 2)
      .attr('y', 0 - margin.top / 2);
    svg
      .select('.subtitle')
      .attr('x', width / 2)
      .attr('y', 0 - margin.top / 2 + 25);
    // rotate axis text
    svg
      .select('.x.axis')
      .selectAll('text')
      .attr('transform', 'rotate(45)')
      .style('text-anchor', 'start');

    if (parseInt(width) >= 600) {
      // level axis text
      svg
        .select('.x.axis')
        .selectAll('text')
        .attr('transform', 'rotate(0)')
        .style('text-anchor', 'middle');
    }
  }

  return { init, update };
};

export default BarChart;
