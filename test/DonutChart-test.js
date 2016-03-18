import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import DonutChart from '../src/DonutChart';

describe.only('<DonutChart />', function() {
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

  xit('renders a <DonutChart /> with some data', function(){
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
    expect(html).to.match(/g class="x axis"/);
    expect(html).to.match(/line x2=/);
  });

  xit('should not blow up if no data is passed to it', function(){
    const wrapper = shallow(<DonutChart height={ height } width={ width } />);
    const chart = wrapper.find('.chart');
    expect(chart).to.have.length(1);
    expect(wrapper.html()).to.contain('No data available');
  });

  xit('should not blow up if an empty array of data is passed to it', function(){
    const wrapper = shallow(<DonutChart height={ height } width={ width } data={[]} />);
    const chart = wrapper.find('.chart');
    expect(chart).to.have.length(1);
    expect(wrapper.html()).to.contain('No data available');
  });

  xit('should not blow up if an empty object of data is passed to it', function(){
    const wrapper = shallow(<DonutChart height={ height } width={ width } data={{}} />);
    const chart = wrapper.find('.chart');
    expect(chart).to.have.length(1);
    expect(wrapper.html()).to.contain('No data available');
  });
});
