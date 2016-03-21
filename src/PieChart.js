import React, { Component } from 'react';
import DonutChart from './DonutChart';
import _ from 'lodash';

/* Pie charts are just donut charts without a hole */
class PieChart extends Component {

  render() {
    const props = _.omit(this.props, ['outerRadius']);
    props.outerRadius = 0.1;
    return (
      <DonutChart {...props} />
    );
  }

}

export default PieChart;

