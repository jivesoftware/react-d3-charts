import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import SparklineChart from '../src/SparklineChart';

describe('<SparklineChart />', function() {
  const height = 50;
  const width = 100;

  it('renders a <SparklineChart /> component', function(){
    const data = [ { label: 'apples', values: [{ x: 0, y: 0 }] } ];
    const wrapper = shallow(<SparklineChart height={ height } width={ width } data={ data } />);
    const html = wrapper.html();
    expect(html).to.not.match(/g class="x axis"/);
    expect(html).to.not.match(/g class="y axis"/);
    expect(html).to.match(/path class="line"/);
  });
});

