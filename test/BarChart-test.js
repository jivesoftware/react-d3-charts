import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import BarChart from '../lib/BarChart';

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

});

