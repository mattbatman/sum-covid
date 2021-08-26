import * as d3 from './d3-roll';
import * as R from 'ramda';

const LineChart = () => {
  let data = [];
  let selector = '';
  let margin = { top: 10, right: 0, bottom: 40, left: 60 };
  let width;
  let height;
  let svg;
  let xk;
  let yk;
  let xScale;
  let yScale;
  let xAxis;
  let yAxis;
  let line;
  let title = '';
  let subtitle = '';
  let tooltip;
  let tipBody;

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

  function update({ newData, xKey, yKey }) {
    data = newData;
    xk = xKey;
    yk = yKey;

    xScale = d3.scaleTime();
    xAxis = d3.axisBottom(xScale);
    yScale = d3.scaleLinear();
    yAxis = d3.axisLeft(yScale);

    const xDomain = d3.extent(data.map((d) => d[xk]));
    const yMax = d3.max(R.map((d) => d[yk], data));
    xScale.domain(xDomain).range([0, width]);
    yScale.domain([0, yMax]).range([height, 0]);

    xAxis.scale(xScale);
    yAxis.scale(yScale);

    line = d3
      .line()
      .x((d) => xScale(d[xk]))
      .y((d) => yScale(d[yk]));

    svg
      .append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('class', 'yellow-line')
      .attr('stroke', 'yellow')
      .attr('stroke-width', 1.5)
      .attr('stroke-linejoin', 'round')
      .attr('stroke-linecap', 'round')
      .attr('d', line);

    // call the axes
    svg.select('.x.axis').call(xAxis);
    svg.select('.y.axis').call(yAxis);
  }

  function resize(event) {
    width =
      parseInt(d3.select(selector).style('width')) - margin.left - margin.right;
    height =
      parseInt(d3.select(selector).style('height')) -
      margin.top -
      margin.bottom;

    xScale.range([0, width]);
    yScale.range([height, 0]);

    // reset the axes
    xAxis.scale(xScale);
    yAxis.scale(yScale);
    // call the axes
    svg.select('.x.axis').call(xAxis);
    svg.select('.y.axis').call(yAxis);

    line = d3
      .line()
      .x((d) => xScale(d[xk]))
      .y((d) => yScale(d[yk]));

    svg.select('path.yellow-line').attr('d', line);
  }

  return { init, update };
};

export default LineChart;
