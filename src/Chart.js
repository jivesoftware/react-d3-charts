import React from 'react';
import Legend from './Legend';
import _ from 'lodash';

const Chart = React.createClass({
  propTypes: {
    height: React.PropTypes.number.isRequired,
    width: React.PropTypes.number.isRequired,
    legend: React.PropTypes.object,
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
      legend: {}
    };
  },

  render() {
    const { width, height, margin, viewBox, preserveAspectRatio, children, legend} = this.props;
    let legendOffset = 0;
    let showTopLegend = false;
    let showBottomLegend = false;

    if (_.isPlainObject(this.props.legend)){
      if (_.isArray(this.props.legend.data) && this.props.legend.data.length > 0){
        if (_.isString(this.props.legend.position)){
          switch(this.props.legend.position.toLowerCase()){
            case 'top':
              showTopLegend = true;
              break;
            case 'bottom':
              showBottomLegend = true;
              break;
            case 'both':
              showTopLegend = true;
              showBottomLegend = true;
              break;
            default:
              showTopLegend = false;
              showBottomLegend = false;
              break;
          }//end switch
          if (showTopLegend || showBottomLegend){
            legendOffset += 50;
          }
        }
      }
    }
    return (
      <div>
        <svg width={width} height={height+legendOffset} viewBox={viewBox} preserveAspectRatio={preserveAspectRatio} >
          { showTopLegend && <Legend x={margin.left} y={margin.top} data={legend.data} /> }
          <g transform={`translate(${margin.left}, ${margin.top})`}>{children}</g>
          { showBottomLegend && <Legend x={margin.left} y={margin.top + height} data={legend.data} /> }
        </svg>
      </div>
    );
  }
});

module.exports = Chart;
