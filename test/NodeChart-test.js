import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import NodeChart from '../src/NodeChart';

describe('<NodeChart />', function() {
  const height = 100;
  const width = 100;

  it('renders a <NodeChart /> component', function(){
    const data = [];
    const wrapper = shallow(<NodeChart height={ height } width={ width } data={ data } />);
    const chart = wrapper.find('.chart');
    expect(chart).to.have.length(1);
    const props = chart.props();
    expect(props.height).to.equal(height);
    expect(props.width).to.equal(width);
  });

  it('renders a <NodeChart /> with some data', function(){

    const nodeTree = {
      name: 'A',
      value: 20,
      imageUrl: 'https://placekitten.com/30/30',
      children: [
        {
          name: 'B',
          value: 15,
          imageUrl: 'https://placekitten.com/30/30',
          children: [
            {
              name: 'E',
              value: 9
            }
          ]
        },
        {
          name: 'C',
          value: 25,
          imageUrl: 'https://placekitten.com/30/30',
          children: null
        }
      ]
    };

    const wrapper = shallow(<NodeChart height={ height } width={ width } data={ nodeTree } />);
    const chart = wrapper.find('.chart');
    expect(chart).to.have.length(1);
    const props = chart.props();
    expect(props.height).to.equal(height);
    expect(props.width).to.equal(width);
    const html = wrapper.html();
    expect(html).to.match(/circle class="node"/);
  });

});


