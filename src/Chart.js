import React from 'react';
import Legend from './Legend';
import _ from 'lodash';

const Chart = React.createClass({
  propTypes: {
    height: React.PropTypes.number.isRequired,
    width: React.PropTypes.number.isRequired,
    legend: React.PropTypes.arrayOf(React.PropTypes.object),
    children: React.PropTypes.arrayOf(React.PropTypes.object),
    margin: React.PropTypes.shape({
      top: React.PropTypes.number,
      bottom: React.PropTypes.number,
      left: React.PropTypes.number,
      right: React.PropTypes.number
    }).isRequired
  },

  getDefaultProps() {
    return {
      legend: []
    };
  },

  render() {
    const { width, height, margin, viewBox, preserveAspectRatio, children, legend} = this.props;
    const legendOffset = 0;
    const showLegend = _.isArray(this.props.legend) && this.props.legend.length > 0;
    return (
      <div>
        <svg width={width} height={height+legendOffset} viewBox={viewBox} preserveAspectRatio={preserveAspectRatio} >
          <g transform={`translate(${margin.left}, ${margin.top})`}>{children}</g>
          { showLegend && <Legend data={legend} /> }
        </svg>
      </div>
    );
  }
});

module.exports = Chart;
