import * as d3 from './d3-roll';

const PieChart = () => {
  let data = [];
  let sel = '';
  let svg;
  let width;
  let height;
  let lk;
  let vk;
  let margin = {
    top: 0,
    bottom: 0,
    right: 20,
    left: 20
  };
  let color;
  let arc;
  let pie;
  let arcLabel;

  function create({ rawData, selector, labelKey, valueKey }) {
    data = rawData;
    sel = selector;
    lk = labelKey;
    vk = valueKey;

    width =
      parseInt(d3.select(sel).style('width')) - margin.left - margin.right;
    height = Math.min(width, 400);

    color = (label) => (label === 'Yes' ? '#000000' : '#ffffff');

    const radius = (Math.min(width, height) / 2) * 0.8;
    arcLabel = d3.arc().innerRadius(radius).outerRadius(radius);

    arc = d3
      .arc()
      .innerRadius(0)
      .outerRadius(Math.min(width, height) / 2 - 1);

    pie = d3
      .pie()
      .sort(null)
      .value((d) => d[vk]);

    const arcs = pie(data);

    svg = d3
      .select(sel)
      .append('svg')
      .attr('viewBox', [-width / 2, -height / 2, width, height])
      .attr('preserveAspectRatio', 'xMinYMin');

    svg
      .append('g')
      .attr('stroke', '#000000')
      .selectAll('path')
      .data(arcs)
      .join('path')
      .attr('fill', (d) => color(d.data[lk]))
      .attr('d', arc)
      .append('title')
      .text((d) => `${d.data[lk]}: ${d.data[vk].toLocaleString()}`);

    svg
      .append('g')
      .attr('font-size', '1rem')
      .attr('text-anchor', 'middle')
      .selectAll('text')
      .data(arcs)
      .join('text')
      .attr('transform', (d) => `translate(${arcLabel.centroid(d)})`)
      .call((text) =>
        text
          .append('tspan')
          .attr('y', '-0.4em')
          .attr('font-weight', 'bold')
          .attr('fill', (d) => (d.data[lk] === 'Yes' ? '#ffffff' : '#000000'))
          .text((d) => d.data[lk])
      )
      .call((text) =>
        text
          .filter((d) => d.endAngle - d.startAngle > 0.25)
          .append('tspan')
          .attr('x', 0)
          .attr('y', '0.7em')
          .attr('fill', (d) => (d.data[lk] === 'Yes' ? '#ffffff' : '#000000'))
          .text((d) => d.data[vk].toLocaleString())
      );

    // call resize
    d3.select(window).on('resize', resize);
  }

  function resize(event) {
    width =
      parseInt(d3.select(sel).style('width')) - margin.left - margin.right;
    height = Math.min(width, 400);

    const radius = (Math.min(width, height) / 2) * 0.8;
    arcLabel = d3.arc().innerRadius(radius).outerRadius(radius);

    svg = d3
      .select(sel)
      .select('svg')
      .attr('viewBox', [-width / 2, -height / 2, width, height]);
  }

  return {
    create
  };
};

export default PieChart;
