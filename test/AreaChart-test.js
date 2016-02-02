import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import AreaChart from '../src/AreaChart';

describe('<AreaChart />', function() {
  const height = 100;
  const width = 100;

  it('renders a <AreaChart /> component', function(){
    const data = [ { label: 'apples', values: [{ x: 0, y: 0 }] } ];
    const wrapper = shallow(<AreaChart height={ height } width={ width } data={ data } />);
    const chart = wrapper.find('.chart');
    expect(chart).to.have.length(1);
    const props = chart.props();
    expect(props.height).to.equal(height);
    expect(props.width).to.equal(width);
  });

});
