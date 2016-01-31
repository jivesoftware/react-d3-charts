import React from 'react';
import BarChart from '../../src/BarChart.js';
import LineChart from '../../src/LineChart.js';
import '../css/main.scss';

const margin = {top: 10, bottom: 50, left: 50, right: 10};

const barToolTips = function(x, y0, y, total, dataLabel){
  return (
    <div className='tip'>
      <dl>
        <dt>x</dt>
        <dd>{ x }</dd>
        <dt>y0</dt>
        <dd>{y0}</dd>
        <dt>total</dt>
        <dd>{total}</dd>
        <dt>dataLabel</dt>
        <dd>{dataLabel}</dd>
      </dl>
    </div> );
};

const lineToolTips = function(label, value){
  return (
    <div className='tip'>
      <dl>
        <dt>label</dt>
        <dd>{ label }</dd>
        <dt>value</dt>
        <dd>{value}</dd>
      </dl>
    </div> );
};

const toolTipOffset = {top: 10, left: 10};

const barData = [{
  label: 'Fruits',
  values: [{x: 'Apple', y: 10}, {x: 'Peaches', y: 4}, {x: 'Pumpkin Pie', y: 3}]
}];

const lineData = [
  {
    label: 'Apple',
    values: [{x: 0, y: 2}, {x: 1.3, y: 5}, {x: 3, y: 6}, {x: 3.5, y: 6.5}, {x: 4, y: 6}, {x: 4.5, y: 6}, {x: 5, y: 7}, {x: 5.5, y: 8}]
  },
  {
    label: 'Peaches',
    values: [{x: 0, y: 3}, {x: 1.3, y: 4}, {x: 3, y: 7}, {x: 3.5, y: 8}, {x: 4, y: 7}, {x: 4.5, y: 7}, {x: 5, y: 7.8}, {x: 5.5, y: 9}]
  }
];


const legendData = {
  position: 'bottom',
  data: [
    { 'apple': '#ff0000' },
    { 'peaches': '#00ff00' },
    { 'pumpkin-pie': '#0000ff' }
  ]
};

React.render(
  <div className='charts'>

    <section className='chart'>
      <h1>Bar Chart</h1>
      <BarChart
        data={barData}
        height={400}
        width={400}
        margin={margin}
        tooltipHtml={barToolTips}
        tooltipOffset={toolTipOffset}/>
    </section>

    <section className='chart last'>
      <h1>Bar Chart (with Legend)</h1>
      <BarChart
        data={barData}
        height={400}
        width={400}
        margin={margin}
        legend={legendData}
        tooltipOffset={toolTipOffset}
        tooltipHtml={barToolTips} />
    </section>

    <section className='chart'>
      <h1>Line Chart</h1>
      <LineChart
        data={lineData}
        height={400}
        width={400}
        margin={margin}
        tooltipOffset={toolTipOffset}
        tooltipHtml={lineToolTips} />
    </section>

    <section className='chart last'>
      <h1>Line Chart (with Legend)</h1>
      <LineChart
        data={lineData}
        height={400}
        width={400}
        margin={margin}
        legend={legendData}
        tooltipOffset={toolTipOffset}
        tooltipHtml={lineToolTips} />
    </section>

    <section className='chart'>
      <h1>Line Chart (with Grid Lines)</h1>
      <LineChart
        data={lineData}
        height={400}
        width={400}
        margin={margin}
        xAxis={{ gridLines: true }}
        yAxis={{ gridLines: true }}
        tooltipOffset={toolTipOffset}
        tooltipHtml={lineToolTips} />
    </section>

  </div>,
  document.getElementById('demo')
);

