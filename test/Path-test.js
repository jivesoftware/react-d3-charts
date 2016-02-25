import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import Path from '../src/Path';
import d3 from 'd3/d3.min.js';

describe('<Path />', function() {

  const stroke= 'gray';
  const data=[ {x: 0, y: 2}, {x: 1.3, y: 5}, {x: 3, y: 6}, {x: 3.5, y: 6.5}, {x: 4, y: 6}, {x: 4.5, y: 6}, {x: 5, y: 7}, {x: 5.5, y: 8} ];
  const line = d3.svg.line().x((d) => { return d.x; }).y((d) => { return d.y; }).interpolate('basis');
  const d = line(data);

  it('renders a <Path /> component', function() {
    const wrapper = shallow(<Path d={d} stroke={stroke} data={data} />);
    const path = wrapper.find('path.path');
    expect(path).to.have.length(1);
    const props = path.props();
    expect(props.d).to.equal(d);
    expect(props.stroke).to.equal(stroke);
  });

  it('supports mouse events', function() {
    const mouseEvent = { pageX: 0, pageY: 2};
    const handleMouseMove = sinon.spy();
    const handleMouseLeave = sinon.spy();
    const wrapper = shallow(<Path d={d} stroke={stroke} data={data} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} />);
    const path = wrapper.find('path.path');
    path.simulate('mouseMove', mouseEvent);
    path.simulate('mouseLeave', mouseEvent);
    expect(handleMouseMove.called).to.be.true;
    expect(handleMouseMove.args[0][0]).to.equal(mouseEvent);
    expect(handleMouseMove.args[0][1]).to.equal(data);
    expect(handleMouseLeave.calledOnce).to.be.true;
    expect(handleMouseLeave.args[0][0]).to.equal(mouseEvent);
  });

});

