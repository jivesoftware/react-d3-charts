import React from 'react';
import ReactDOM from 'react-dom';
import BarChart from '../../src/BarChart.js';
import LineChart from '../../src/LineChart.js';
import SparklineChart from '../../src/SparklineChart.js';
import AreaChart from '../../src/AreaChart.js';
import DonutChart from '../../src/DonutChart.js';
import PieChart from '../../src/PieChart.js';
import NodeChart from '../../src/NodeChart.js';
import Tabs from 'react-simpletabs';
import '../css/main.scss';
import _ from 'lodash';

const colorScale= d3.scale.category20();
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
        <dd>{value.x}, {value.y}</dd>
      </dl>
    </div> );
};

const areaToolTips = function(label, value){
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

const donutToolTips = function(label, value){
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

const nodeToolTips = function(label, value){
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

const sparkLineData = [
  {
    label: 'Chickens',
    values: [{x: 0, y: 2}, {x: 1.3, y: 5}, {x: 3, y: 6}, {x: 3.5, y: 6.5}, {x: 4, y: 6}, {x: 4.5, y: 6}, {x: 5, y: 7}, {x: 5.5, y: 8}]
  },
  {
    label: 'Cows',
    values: [{x: 0, y: 0}, {x: 1.3, y: 20}, {x: 3, y: 7}, {x: 3.5, y: 10}, {x: 4, y: 0}, {x: 4.5, y: 20}, {x: 5, y: 17.8}, {x: 5.5, y: 9}]
  }
];

const donutData = [
  {
    label: 'Apple',
    values: [{x: 'Apple', y: 10}, {x: 'Peaches', y: 4}, {x: 'Pumpkin', y: 3}]
  }
];

const nodeData = {
  nodes: [
    {
      name: 'A',
      x: 200,
      y: 150,
      value: 20
    },
    {
      name: 'B',
      x: 140,
      y: 300,
      value: 15
    },
    {
      name: 'C',
      x: 300,
      y: 300,
      value: 25
    },
    {
      name: 'D',
      x: 300,
      y: 180,
      value: 8
    }
  ],
  links: [
    {
      source: 0,
      target: 1
    },
    {
      source: 0,
      target: 2
    },
    {
      source: 0,
      target: 3
    }
  ]
};

const legendData = function(options) {
  const config = _.defaults({}, options, {
    wrapText: true,
    align: 'center',
    data: [
      { 'apple': '#ff0000' },
      { 'peaches': '#00ff00' },
      { 'pumpkin-pie': '#0000ff' }
    ],
    position: 'bottom',
    symbolPosition: 'left',
    symbolOffset: 20,
    symbolType: 'circle'
  });

  return config;
};

ReactDOM.render(
  <Tabs>
    <Tabs.Panel title='Bar Charts'>
      <div className='charts'>
        <section className='chart'>
          <h1>Bar Chart</h1>
          <BarChart
            colorScale={colorScale}
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
            colorScale={colorScale}
            data={barData}
            height={400}
            width={400}
            margin={margin}
            legend={legendData()}
            tooltipOffset={toolTipOffset}
            tooltipHtml={barToolTips} />
        </section>
      </div>
    </Tabs.Panel>

    <Tabs.Panel title='Line Charts'>
      <div className='charts'>
        <section className='chart'>
          <h1>Line Chart</h1>
          <LineChart
            colorScale={colorScale}
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
            colorScale={colorScale}
            data={lineData}
            height={400}
            width={400}
            margin={margin}
            legend={legendData()}
            tooltipOffset={toolTipOffset}
            tooltipHtml={lineToolTips} />
        </section>
        <section className='chart'>
          <h1>Line Chart (with Grid Lines)</h1>
          <LineChart
            colorScale={colorScale}
            data={lineData}
            height={400}
            width={400}
            margin={margin}
            xAxis={{ gridLines: true }}
            yAxis={{ gridLines: true }}
            tooltipOffset={toolTipOffset}
            tooltipHtml={lineToolTips} />
        </section>
      </div>
    </Tabs.Panel>

    <Tabs.Panel title='Area Charts'>
      <div className='charts'>
        <section className='chart last'>
          <h1>Area Chart</h1>
          <AreaChart
            colorScale={colorScale}
            data={lineData[0]}
            height={400}
            width={400}
            margin={margin}
            tooltipOffset={toolTipOffset}
            tooltipHtml={areaToolTips} />
        </section>
      </div>
    </Tabs.Panel>

    <Tabs.Panel title='Sparkline Charts'>
      <div className='charts'>
        <section className='spark chart'>
          <h1>Sparkline Chart</h1>
          <SparklineChart
            colorScale={colorScale}
            data={sparkLineData[0]}
            height={50}
            width={200}
            margin={{top: 10, bottom: 10, left: 10, right: 10}}
            tooltipOffset={toolTipOffset}
            tooltipHtml={lineToolTips} />
        </section>
        <section className='spark chart last'>
          <h1>Sparkline Chart</h1>
          <SparklineChart
            colorScale={colorScale}
            data={sparkLineData[1]}
            height={50}
            width={200}
            margin={{top: 10, bottom: 10, left: 10, right: 10}}
            tooltipOffset={toolTipOffset}
            tooltipHtml={lineToolTips} />
        </section>
      </div>
    </Tabs.Panel>

    <Tabs.Panel title='Donut Charts'>
      <div className='charts'>
        <section className='chart last'>
          <h1>Donut Chart</h1>
          <DonutChart
            colorScale={colorScale}
            data={donutData[0]}
            height={400}
            width={400}
            margin={margin}
            tooltipOffset={toolTipOffset}
            tooltipHtml={ donutToolTips } />
        </section>
      </div>
    </Tabs.Panel>

    <Tabs.Panel title='Pie Charts'>
      <div className='charts'>
        <section className='chart last'>
          <h1>Pie Chart</h1>
          <PieChart
            colorScale={colorScale}
            data={donutData[0]}
            height={400}
            width={400}
            margin={margin}
            tooltipOffset={toolTipOffset}
            tooltipHtml={ donutToolTips } />
        </section>
      </div>
    </Tabs.Panel>

    <Tabs.Panel title='Node Charts'>
      <div className='charts'>
        <section className='chart last'>
          <h1>Node Chart</h1>
          <NodeChart
            colorScale={colorScale}
            data={nodeData}
            height={400}
            width={400}
            margin={margin}
            tooltipOffset={toolTipOffset}
            tooltipHtml={ nodeToolTips } />
        </section>
      </div>
    </Tabs.Panel>


    <Tabs.Panel title='Legends'>
      <div className='charts'>
        <section className='chart'>
          <h1>Symbols on Left</h1>
          <LineChart
            colorScale={colorScale}
            data={lineData}
            height={400}
            width={400}
            margin={margin}
            legend={legendData()}
            tooltipOffset={toolTipOffset}
            tooltipHtml={lineToolTips} />
        </section>
        <section className='chart last'>
          <h1>Square Symbols on Top</h1>
          <LineChart
            colorScale={colorScale}
            data={lineData}
            height={400}
            width={400}
            margin={margin}
            legend={legendData({ symbolPosition: 'top', symbolOffset: 10, symbolType: 'square' })}
            tooltipOffset={toolTipOffset}
            tooltipHtml={lineToolTips} />
        </section>
        <section className='chart'>
          <h1>No Text Wrap</h1>
          <LineChart
            colorScale={colorScale}
            data={lineData}
            height={400}
            width={400}
            margin={margin}
            legend={legendData({ wrapText: false })}
            tooltipOffset={toolTipOffset}
            tooltipHtml={lineToolTips} />
        </section>
      </div>
    </Tabs.Panel>

  </Tabs>,
  document.getElementById('demo')
);

