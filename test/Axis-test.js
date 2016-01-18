import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import Axis from '../lib/Axis';
import d3 from 'd3';

describe('<Axis />', function() {

  it('renders an <Axis /> component', function() {
    const scale = d3.scale.linear();
    const wrapper = shallow(<Axis scale={scale} orientation='top' />);
    expect(wrapper.find('g.axis')).to.have.length(1);
    expect(wrapper.find('g.tick.even').length).to.be.gt(1);
    expect(wrapper.find('g.tick.odd').length).to.be.gt(1);
    expect(wrapper.find('path.domain')).to.have.length(1);
    expect(wrapper.find('text.axis.label')).to.have.length(1);
  });

});
