import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import DonutChart from '../src/DonutChart';

describe('<DonutChart />', function() {
  const height = 100;
  const width = 100;

  it('renders a <DonutChart /> component', function(){
    const data = [];
    const wrapper = shallow(<DonutChart height={ height } width={ width } data={ data } />);
    const chart = wrapper.find('.chart');
    expect(chart).to.have.length(1);
    const props = chart.props();
    expect(props.height).to.equal(height);
    expect(props.width).to.equal(width);
  });

  it('renders a <DonutChart /> with some data', function(){
    const data = {
      label: 'Apple',
      values: [{x: 'Apple', y: 10}, {x: 'Peaches', y: 4}, {x: 'Pumpkin', y: 3}]
    };
    const wrapper = shallow(<DonutChart height={ height } width={ width } data={ data } />);
    const chart = wrapper.find('.chart');
    expect(chart).to.have.length(1);
    const props = chart.props();
    expect(props.height).to.equal(height);
    expect(props.width).to.equal(width);
    const html = wrapper.html();
    expect(html).to.match(/path class="arc"/);
  });
});
