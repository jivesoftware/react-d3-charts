import React from 'react';
import BarChart from '../../src/BarChart.js';

const data = [{
  label: 'somethingA',
  values: [{x: 'Apple', y: 10}, {x: 'Peaches', y: 4}, {x: 'Pumpkin Pie', y: 3}]
}];

const margin = {top: 10, bottom: 50, left: 50, right: 10};
const legend = {
  position: 'bottom',
  data: [
    { 'apple': '#ff0000' },
    { 'peaches': '#00ff00' },
    { 'pumpkin-pie': '#0000ff' }
  ]
};

React.render(
  <BarChart data={data} height={400} width={400} margin={margin} legend={legend} />,
  document.getElementById('demo')
);

