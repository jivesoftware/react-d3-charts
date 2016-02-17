import React from 'react';
import { shallow, render } from 'enzyme';
import { expect } from 'chai';
import Chart from '../src/Chart';

describe('<Chart />', function() {
  const height = 100;
  const width = 100;
  const margin = {
    top: 0,
    left: 0,
    bottom: 0,
    right: 0
  };

  function testChartWithLegend(position){
    return function(){
      const legend = {
        position: position,
        data: [
          { 'apple': '#dddddd' },
          { 'peach': '#cdcdcd' }
        ]
      };
      const wrapper = render(<Chart height={ height } width={ width } margin={ margin } legend={ legend } />);
      expect(wrapper.find('g.legend')).to.have.length(position === 'both' ? 2 : 1);
      expect(wrapper.find('g.cells')).to.have.length(position === 'both' ? 2 : 1);
      expect(wrapper.find('g.cell')).to.have.length(position === 'both' ? 4 : 2);
      expect(wrapper.find('text.label')).to.have.length(position === 'both' ? 4 : 2);
    };
  }

  it('renders a <Chart /> component', function() {
    const wrapper = shallow(<Chart height={ height } width={ width } margin={ margin } />);
    const chart = wrapper.find('svg');
    expect(chart).to.have.length(1);
    const props = chart.props();
    expect(props.height).to.equal(height);
    expect(props.height).to.equal(height);
    expect(props.width).to.equal(width);
  });

  it('renders a <Chart /> with a top legend', testChartWithLegend('top'));
  it('renders a <Chart /> with a bottom legend', testChartWithLegend('bottom'));

});
