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
    const data = {
      label: 'Apple',
      values: [{x: 'Apple', y: 10}, {x: 'Peaches', y: 4}, {x: 'Pumpkin', y: 3}]
    };
    const nodeData = {
      nodes: [
        {
          name: 'A',
          x: 200,
          y: 150,
          value: 20
        },
        {
          name: 'B',
          x: 140,
          y: 300,
          value: 15
        },
        {
          name: 'C',
          x: 300,
          y: 300,
          value: 25
        },
        {
          name: 'D',
          x: 300,
          y: 180,
          value: 8
        }
      ],
      links: [
        {
          source: 0,
          target: 1
        },
        {
          source: 1,
          target: 2
        },
        {
          source: 2,
          target: 3
        }
      ]
    };

    const wrapper = shallow(<NodeChart height={ height } width={ width } data={ nodeData } />);
    const chart = wrapper.find('.chart');
    expect(chart).to.have.length(1);
    const props = chart.props();
    expect(props.height).to.equal(height);
    expect(props.width).to.equal(width);
    const html = wrapper.html();
    expect(html).to.match(/circle class="node"/);
  });

});


