import React, { PropTypes, Component } from 'react';
import Legend from './Legend';
import _ from 'lodash';

class Chart extends Component {

  static propTypes = {
    className: PropTypes.string,
    height: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    legend: PropTypes.object,
    defs: PropTypes.arrayOf(PropTypes.object),
    children: PropTypes.oneOfType([ PropTypes.object, PropTypes.array ]),
    margin: PropTypes.shape({
      top: PropTypes.number,
      bottom: PropTypes.number,
      left: PropTypes.number,
      right: PropTypes.number
    }).isRequired
  };

  static defaultProps = {
    className: 'chart',
    defs: [],
    legend: {
    },
    margin: {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0
    }
  };

  constructor(props){
    super(props);
    this.state = {
      legendX: props.margin.left,
      legendY: props.margin.top + props.height
    };
  }

  componentDidMount() {
    this.alignLegend();
  }

  componentDidUpdate(prevProps) {
    if (!_.isEqual(this.props, prevProps)){
      this.alignLegend();
    }
  }

  hasLegend(){
    if (_.isPlainObject(this.props.legend)){
      return _.isArray(this.props.legend.data) && this.props.legend.data.length > 0;
    }
    return false;
  }

  alignLegend() {
    if (this.hasLegend()){

      let legendX, legendY;

      const chart = d3.select(this.refs.chart);
      const legend = chart.select('g.legend');
      const bbox = legend.node().getBBox();
      const align = _.isString(this.props.legend.align) ? this.props.legend.align : 'left';
      const position = _.isString(this.props.legend.position) ? this.props.legend.position : 'bottom';

      switch (align.toLowerCase()){
        case 'right':
          legendX = (this.props.width - this.props.margin.right) - bbox.width;
          break;
        case 'center':
          legendX = (this.props.width / 2) - (bbox.width / 2);
          break;
        case 'left':
        default:
          legendX = this.props.margin.left;
          break;
      }//end switch

      switch (position){
        case 'top':
          legendY = this.props.margin.top;
          break;
        case 'bottom':
        default:
          legendY = this.props.height;
          break;
      }
      this.setState({ legendX: legendX, legendY: legendY });
    }
  }

  render() {
    const { width, height, margin, viewBox, preserveAspectRatio, children } = this.props;

    let legendOffset = 0;

    const hasLegend = this.hasLegend();

    if (hasLegend){
      legendOffset += 50;
    }

    return (
      <div className={ this.props.className } ref='chart'>
        <svg width={width} height={height+legendOffset} viewBox={viewBox} preserveAspectRatio={preserveAspectRatio} >
          { this.props.defs }
          <g transform={`translate(${margin.left}, ${margin.top})`}>{children}</g>
          {
            hasLegend && <Legend x={this.state.legendX} y={this.state.legendY} {...this.props.legend} />
          }
        </svg>
      </div>
    );
  }

}

export default Chart;
