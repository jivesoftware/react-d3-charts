import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import Axis from '../src/Axis';
import d3 from 'd3/d3.min.js';
import sinon from 'sinon';

describe('<Axis />', function() {

  function testAxis(scale, orientation, tickFormat=null, tickFilter=null){
    const wrapper = shallow(<Axis scale={scale} orientation={orientation} tickFormat={tickFormat} tickFilter={tickFilter} />);
    expect(wrapper.find('g.axis')).to.have.length(1);
    expect(wrapper.find('g.tick.even').length).to.be.gt(1);
    expect(wrapper.find('g.tick.odd').length).to.be.gt(1);
    expect(wrapper.find('path.domain')).to.have.length(1);
    expect(wrapper.find('text.axis.label')).to.have.length(1);
    return wrapper;
  }

  it('renders an <Axis /> component', function() {
    const scale = d3.scale.linear();
    testAxis(scale, 'top');
    testAxis(scale, 'bottom');
    testAxis(scale, 'left');
    testAxis(scale, 'right');
  });

  it('should support a custom tick format', function(){
    const scale = d3.scale.linear();
    const format = d3.format(',.0f');
    const tickFormatter = function(x){ return format(x); };
    testAxis(scale, 'top', tickFormatter);
  });

  it('should add a hidden class to any axes with an empty label', function(){
    const scale = d3.scale.linear();
    const tickFormatter = function(){ return ''; };
    const wrapper = testAxis(scale, 'top', tickFormatter);
    expect(wrapper.find('.tick.hidden').length).to.be.gt(1);
  });

  it('should support a custom tick filter', function(){
    const scale = d3.scale.linear();
    const tickFilter = sinon.spy(function(){ return true; });
    testAxis(scale, 'top', null, tickFilter);
  });

});
