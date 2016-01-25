import React, { PropTypes, Component } from 'react';
import d3 from 'd3';
import color from 'sc-color';

class Legend extends Component {

  static propTypes = {
    legendClassName: PropTypes.string,
    cellsClassName: PropTypes.string,
    cellClassName: PropTypes.string,
    cellTextClassName: PropTypes.string,
    symbolType: PropTypes.oneOf(['circle', 'cross', 'diamond', 'square', 'triangle-down', 'triangle-up']),
    symbolSize: PropTypes.number,
    x: PropTypes.number,
    y: PropTypes.number,
    defaultSymbolColor: PropTypes.string,
    data: PropTypes.arrayOf(PropTypes.object).isRequired
  };

  static defaultProps = {
    legendClassName: 'legend',
    cellsClassName: 'cells',
    cellClassName: 'cell',
    cellTextClassName: 'label',
    symbolType: 'circle',
    symbolSize: 80,
    x: 0,
    y: 0,
    defaultSymbolColor: '#000000'
  };

  render() {
    const cells = this.props.data.map((obj, index) =>{
      const symbolOffset = 50;
      const symbolPathData = d3.svg.symbol().type(this.props.symbolType).size(this.props.symbolSize)();
      const keys = Object.keys(obj);
      const symbolColor = keys.length ? color(obj[keys[0]]).html() : color(this.props.defaultSymbolColor).html();
      const cellTransform=`translate(0,0)`;

      return (
        <g key={ this.props.cellClassName + index } className={this.props.cellClassName} transform={cellTransform}>
          <path d={symbolPathData} style={{ fill: symbolColor }}></path>
          <text className={this.props.cellTextClassName}>
            <tspan x='0' y='0' dy='0em'>{ keys[0] }</tspan>
          </text>
        </g>
      );
    });

    const legendTransform=`translate(${this.props.x}, ${this.props.y})`;
    return (
      <g className={this.props.legendClassName}  transform={legendTransform}>
        <g className={this.props.cellsClassName}>
        { cells }
        </g>
      </g>
    );
  }
}

export default Legend;
