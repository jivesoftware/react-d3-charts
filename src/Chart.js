import React, { PropTypes, Component } from 'react';
import Legend from './Legend';
import _ from 'lodash';

class Chart extends Component {

  static propTypes = {
    height: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    legend: PropTypes.object,
    children: PropTypes.arrayOf(PropTypes.object),
    margin: PropTypes.shape({
      top: PropTypes.number,
      bottom: PropTypes.number,
      left: PropTypes.number,
      right: PropTypes.number
    }).isRequired
  };

  static defaultProps = {
    legend: {}
  };

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

}

export default Chart;
