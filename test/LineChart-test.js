import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import LineChart from '../src/LineChart';

describe('<LineChart />', function() {
  const height = 100;
  const width = 100;

  it('renders a <LineChart /> component', function(){
    const data = [ { label: 'apples', values: [{ x: 0, y: 0 }] } ];
    const wrapper = shallow(<LineChart height={ height } width={ width } data={ data } />);
    const chart = wrapper.find('.chart');
    expect(chart).to.have.length(1);
    const props = chart.props();
    expect(props.height).to.equal(height);
    expect(props.width).to.equal(width);
    const html = wrapper.html();
    expect(html).to.match(/g class="x axis"/);
    expect(html).to.match(/g class="y axis"/);
    expect(html).to.match(/path class="line"/);
  });

  it('should not blow up if no data is passed to it', function(){
    const wrapper = shallow(<LineChart height={ height } width={ width } />);
    const chart = wrapper.find('.chart');
    expect(chart).to.have.length(1);
    expect(wrapper.html()).to.contain('No data available');
  });

  it('should not blow up if an empty array of data is passed to it', function(){
    const wrapper = shallow(<LineChart height={ height } width={ width } data={[]} />);
    const chart = wrapper.find('.chart');
    expect(chart).to.have.length(1);
    expect(wrapper.html()).to.contain('No data available');
  });

  it('should not blow up if an empty object of data is passed to it', function(){
    const wrapper = shallow(<LineChart height={ height } width={ width } data={{}} />);
    const chart = wrapper.find('.chart');
    expect(chart).to.have.length(1);
    expect(wrapper.html()).to.contain('No data available');
  });

});


