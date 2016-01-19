import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import Bar from '../src/Bar';

describe('<Bar />', function() {

  const width = 100;
  const height = 200;
  const x = 0;
  const y = 10;
  const fill = '#0000';
  const data = [ ];

  it('renders a <Bar /> component', function() {
    const wrapper = shallow(<Bar width={width} height={height} x={x} y={y} fill={fill} data={data} />);

    const rect = wrapper.find('rect.bar');
    expect(rect).to.have.length(1);
    const props = rect.props();
    expect(props.x).to.equal(x);
    expect(props.y).to.equal(y);
    expect(props.width).to.equal(width);
    expect(props.height).to.equal(height);
    expect(props.fill).to.equal(fill);
  });

  it('supports mouse events', function() {
    const mouseEvent = { pageX: x, pageY: y };
    const handleMouseMove = sinon.spy();
    const handleMouseLeave = sinon.spy();
    data.push({ foo: 'bar' });
    const wrapper = shallow(<Bar width={width} height={height} x={x} y={y} fill={fill} data={data} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} />);
    const bar = wrapper.find('rect.bar');
    bar.simulate('mouseMove', mouseEvent);
    bar.simulate('mouseLeave', mouseEvent);
    expect(handleMouseMove.called).to.be.true;
    expect(handleMouseMove.args[0][0]).to.equal(mouseEvent);
    expect(handleMouseMove.args[0][1]).to.equal(data);
    expect(handleMouseLeave.calledOnce).to.be.true;
    expect(handleMouseLeave.args[0][0]).to.equal(mouseEvent);
  });

});

