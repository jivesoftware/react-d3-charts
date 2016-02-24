import React, { Component } from 'react';
import LineChart from './LineChart';
import _ from 'lodash';

class SparklineChart extends Component {

  render() {
    const props = _.omit(this.props, ['xAxis', 'yAxis']);
    props.xAxis = props.yAxis = { visible: false };
    return (
      <LineChart {...props} />
    );
  }

}

export default SparklineChart;

