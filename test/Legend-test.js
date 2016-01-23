import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import Legend from '../src/Legend';

describe('<Legend />', function() {

  it('renders an <Legend /> component', function() {
    const data = [
      { 'apple': '#dddddd' },
      { 'peach': '#cdcdcd' }
    ];
    const wrapper = shallow(<Legend data={data} />);
    expect(wrapper.find('g.legend')).to.have.length(1);
    expect(wrapper.find('g.cells')).to.have.length(1);
    expect(wrapper.find('g.cell')).to.have.length(2);
    expect(wrapper.find('text.label')).to.have.length(2);
  });

});

