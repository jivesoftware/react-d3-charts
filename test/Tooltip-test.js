import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import Tooltip from '../src/Tooltip';

describe('<Tooltip />', function(){

  const top = 0;
  const left = 0;

  it('renders a <Tooltip /> component', function() {
    const wrapper = shallow(<Tooltip top={ top } left={ left } />);
    const tip = wrapper.find('div.tooltip');
    expect(tip).to.have.length(1);
    const props = tip.props();
    expect(props.style.top).to.equal(top);
    expect(props.style.left).to.equal(left);
  });

  it('should be possible to customize the tooltip class', function(){
    const wrapper = shallow(<Tooltip top={ top } left={ left } className='trolltip' />);
    let tip = wrapper.find('div.tooltip');
    expect(tip).to.have.length(0);
    tip = wrapper.find('div.trolltip');
    expect(tip).to.have.length(1);
  });
});


