import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import BarChart from '../src/BarChart';

describe('<BarChart />', function() {
  const height = 100;
  const width = 100;

  it('renders a <BarChart /> component', function() {
    const data = [];
    const wrapper = shallow(<BarChart height={ height } width={ width } data={ data } />);
    const chart = wrapper.find('.chart');
    expect(chart).to.have.length(1);
    const props = chart.props();
    expect(props.height).to.equal(height);
    expect(props.width).to.equal(width);
  });

  it('renders a <BarChart /> with some data', function(){
    const data = [{
      label: 'Fruits',
      values: [{x: 'Apple', y: 10}, {x: 'Peaches', y: 4}, {x: 'Pumpkin Pie', y: 3}]
    }];
    const wrapper = shallow(<BarChart height={ height } width={ width } data={ data } />);
    const chart = wrapper.find('.chart');
    expect(chart).to.have.length(1);
    const props = chart.props();
    expect(props.height).to.equal(height);
    expect(props.width).to.equal(width);
    const html = wrapper.html();
    expect(html).to.match(/g class="x axis"/);
    expect(html).to.match(/rect class="bar"/);
  });

});

