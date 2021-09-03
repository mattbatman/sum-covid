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
  let dot;
  let path;
  let displayDate = d3.timeFormat('%b %e, %g');

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

    tipBody.append('tr').append('td').attr('class', 'first-row');
    tipBody.append('tr').append('td').attr('class', 'second-row');
  }

  function update({ newData, xKey, yKey }) {
    data = newData;
    xk = xKey;
    yk = yKey;

    xScale = d3.scaleTime();
    xAxis = d3.axisBottom(xScale);
    yScale = d3.scaleLinear();
    yAxis = d3.axisLeft(yScale);

    xScale.domain(d3.extent(data.dates)).range([0, width]);
    yScale
      .domain([0, d3.max(data.series, (d) => d3.max(d.values))])
      .nice()
      .range([height, 0]);

    xAxis.scale(xScale);
    yAxis.scale(yScale);

    line = d3
      .line()
      .x((d, i) => xScale(data.dates[i]))
      .y((d) => yScale(d));

    path = svg
      .append('g')
      .attr('fill', 'none')
      .attr('stroke-width', 1.5)
      .attr('stroke-linejoin', 'round')
      .attr('stroke-linecap', 'round')
      .selectAll('path')
      .data(data.series)
      .join('path')
      .style('mix-blend-mode', 'multiply')
      .attr('stroke', (d) => d.color)
      .attr('d', (d) => line(d.values));

    // call the axes
    svg.select('.x.axis').call(xAxis);
    svg.select('.y.axis').call(yAxis);

    // hover effects
    svg.on('mousemove', moved).on('mouseenter', entered).on('mouseleave', left);

    dot = svg.append('g').attr('display', 'none');

    dot.append('circle').attr('r', 2.5);

    dot
      .append('text')
      .attr('font-family', 'sans-serif')
      .attr('font-size', 10)
      .attr('text-anchor', 'middle')
      .attr('y', -8);
  }

  function moved(event) {
    event.preventDefault();
    const pointer = d3.pointer(event, this);
    const xm = xScale.invert(pointer[0]);
    const ym = yScale.invert(pointer[1]);
    const i = d3.bisectCenter(data.dates, xm);
    const s = d3.least(data.series, (d) => Math.abs(d.values[i] - ym));
    path.filter((d) => d === s).raise();
    dot.attr(
      'transform',
      `translate(${xScale(data.dates[i])},${yScale(s.values[i])})`
    );

    updateTooltip(
      event,
      [xk],
      displayDate(data.dates[i]),
      s.name,
      s.values[i],
      s.color
    );
  }

  function entered() {
    dot.attr('display', null);
  }

  function left() {
    dot.attr('display', 'none');
    d3.select(`${selector} .d3-tooltip`).classed('hidden', true);
  }

  function updateTooltip(
    event,
    firstRowLabel = '',
    firstRowKey = '',
    secondRowLabel = '',
    secondRowKey = '',
    color = '#000000'
  ) {
    d3.select(`${selector} .d3-tooltip .first-row`).text(
      `${firstRowLabel}: ${firstRowKey.toLocaleString()}`
    );
    d3.select(`${selector} .d3-tooltip .second-row`).text(
      `${secondRowLabel}: ${secondRowKey.toLocaleString()}`
    );
    d3.select(`${selector} .d3-tooltip tr`).style('border-color', color);
    d3.select(`${selector} .d3-tooltip`)
      .style('border', `3px solid ${color}`)
      .style('color', color)
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

    d3.line()
      .x((d, i) => xScale(data.dates[i]))
      .y((d) => yScale(d));

    path.attr('d', (d) => line(d.values));
  }

  return { init, update };
};

export default LineChart;
