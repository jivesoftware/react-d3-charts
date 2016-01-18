import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import Chart from '../lib/Chart';

describe('<Chart />', function() {
  const height = 100;
  const width = 100;
  const margin = {
    top: 0,
    left: 0,
    bottom: 0,
    right: 0
  };

  it('renders a <Chart /> component', function() {
    const wrapper = shallow(<Chart height={ height } width={ width } margin={ margin } />);
    const chart = wrapper.find('svg');
    expect(chart).to.have.length(1);
    const props = chart.props();
    expect(props.height).to.equal(height);
    expect(props.width).to.equal(width);
  });

});
