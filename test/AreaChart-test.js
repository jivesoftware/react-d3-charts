import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import AreaChart from '../src/AreaChart';

describe('<AreaChart />', function() {
  const height = 100;
  const width = 100;

  it('renders a <AreaChart /> component', function(){
    const data = [];
    const wrapper = shallow(<AreaChart height={ height } width={ width } data={ data } />);
    const chart = wrapper.find('.chart');
    expect(chart).to.have.length(1);
    const props = chart.props();
    expect(props.height).to.equal(height);
    expect(props.width).to.equal(width);
  });

  it('renders a <AreaChart /> with some data', function(){
    const data = [ {
      label: 'Apple',
      values: [{x: 0, y: 2}, {x: 1.3, y: 5}, {x: 3, y: 6}, {x: 3.5, y: 6.5}, {x: 4, y: 6}, {x: 4.5, y: 6}, {x: 5, y: 7}, {x: 5.5, y: 8}]
    }];
    const wrapper = shallow(<AreaChart height={ height } width={ width } data={ data } />);
    const chart = wrapper.find('.chart');
    expect(chart).to.have.length(1);
    const props = chart.props();
    expect(props.height).to.equal(height);
    expect(props.width).to.equal(width);
    const html = wrapper.html();
    expect(html).to.match(/g class="x axis"/);
    expect(html).to.match(/line x2=/);
  });

  it('should not blow up if no data is passed to it', function(){
    const wrapper = shallow(<AreaChart height={ height } width={ width } />);
    const chart = wrapper.find('.chart');
    expect(chart).to.have.length(1);
    expect(wrapper.html()).to.contain('No data available');
  });

  it('should not blow up if an empty array of data is passed to it', function(){
    const wrapper = shallow(<AreaChart height={ height } width={ width } data={[]} />);
    const chart = wrapper.find('.chart');
    expect(chart).to.have.length(1);
    expect(wrapper.html()).to.contain('No data available');
  });

  it('should not blow up if an empty object of data is passed to it', function(){
    const wrapper = shallow(<AreaChart height={ height } width={ width } data={{}} />);
    const chart = wrapper.find('.chart');
    expect(chart).to.have.length(1);
    expect(wrapper.html()).to.contain('No data available');
  });
});
