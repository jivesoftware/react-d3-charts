import React from 'react';
import BarChart from '../../src/BarChart.js';
import LineChart from '../../src/LineChart.js';
import '../css/main.scss';

const margin = {top: 10, bottom: 50, left: 50, right: 10};

const chartData = [{
  label: 'somethingA',
  values: [{x: 'Apple', y: 10}, {x: 'Peaches', y: 4}, {x: 'Pumpkin Pie', y: 3}]
}];

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
      <BarChart data={chartData} height={400} width={400} margin={margin} />
    </section>

    <section className='chart last'>
      <h1>Bar Chart (with Legend)</h1>
      <BarChart data={chartData} height={400} width={400} margin={margin} legend={legendData} />
    </section>

    <section className='chart'>
      <h1>Line Chart</h1>
      <LineChart data={chartData} height={400} width={400} margin={margin} />
    </section>

    <section className='chart last'>
      <h1>Line Chart (with Legend)</h1>
      <LineChart data={chartData} height={400} width={400} margin={margin} legend={legendData} />
    </section>

    <section className='chart'>
      <h1>Line Chart (with Grid Lines)</h1>
      <LineChart data={chartData} height={400} width={400} margin={margin} xAxis={{ gridLines: true }} yAxis={{ gridLines: true }} />
    </section>

  </div>,
  document.getElementById('demo')
);

