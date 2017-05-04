import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import d3 from 'd3/d3.min.js';
import Chart from './Chart';
import Axis from './Axis';
import Path from './Path';
import Tooltip from './Tooltip';
import * as helpers from './helpers.js';

class AreaChart extends Component {

  static propTypes = {
    children: PropTypes.oneOfType([ PropTypes.object, PropTypes.array ]),
    className: PropTypes.string,
    colorScale: PropTypes.func,
    data: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.array
    ]).isRequired,
    height: PropTypes.number.isRequired,
    interpolate: PropTypes.string,
    label: PropTypes.func,
    legend: PropTypes.object,
    margin: PropTypes.shape({
      top: PropTypes.number,
      bottom: PropTypes.number,
      left: PropTypes.number,
      right: PropTypes.number
    }),
    stroke: PropTypes.func,
    tooltipHtml: PropTypes.func,
    tooltipMode: PropTypes.oneOf(['mouse', 'element', 'fixed']),
    tooltipClassName: PropTypes.string,
    tooltipContained: PropTypes.bool,
    tooltipOffset: PropTypes.objectOf(PropTypes.number),
    values: PropTypes.func,
    width: PropTypes.number.isRequired,
    xAxis: PropTypes.object,
    yAxis: PropTypes.object,
    x: PropTypes.func,
    y: PropTypes.func,
    y0: PropTypes.func
  };

  static defaultProps = {
    className: 'chart',
    colorScale: d3.scale.category20(),
    data: {label: 'No data available', values: [{x: 'No data available', y: 1}]},
    interpolate: 'linear',
    label: stack => { return stack.label; },
    margin: {top: 0, bottom: 0, left: 0, right: 0},
    stroke: d3.scale.category20(),
    tooltipMode: 'mouse',
    tooltipOffset: {top: -35, left: 0},
    tooltipClassName: null,
    tooltipHtml: null,
    tooltipContained: false,
    values: stack => { return stack.values; },
    x: e => { return e.x; },
    y: e => { return e.y; },
    y0: () => { return 0; }
  };

  constructor(props) {
    super(props);
    this.state = {
      tooltip: {
        hidden: true
      }
    };
  }

  componentDidMount() {
    this._svg_node = ReactDOM.findDOMNode(this).getElementsByTagName('svg')[0];
  }

  componentWillMount() {
    helpers.calculateInner(this, this.props);
    helpers.arrayify(this, this.props);
    helpers.makeScales(this, this.props);
    helpers.addTooltipMouseHandlers(this);
  }

  componentWillReceiveProps(nextProps) {
    helpers.calculateInner(this, nextProps);
    helpers.arrayify(this, nextProps);
    helpers.makeScales(this, nextProps);
  }

  _tooltipHtml(d, position) {
    const {x, y0, y, values } = this.props;
    const [xScale, yScale] = [this._xScale, this._yScale];

    const xValueCursor = xScale.invert(position[0]);

    const xBisector = d3.bisector(e => { return x(e); }).right;
    let xIndex = xBisector(values(d[0]), xScale.invert(position[0]));
    xIndex = (xIndex === values(d[0]).length) ? xIndex - 1: xIndex;

    const xIndexRight = xIndex === values(d[0]).length ? xIndex - 1: xIndex;
    const xValueRight = x(values(d[0])[xIndexRight]);

    const xIndexLeft = xIndex === 0 ? xIndex : xIndex - 1;
    const xValueLeft = x(values(d[0])[xIndexLeft]);

    if (Math.abs(xValueCursor - xValueRight) < Math.abs(xValueCursor - xValueLeft)) {
      xIndex = xIndexRight;
    } else {
      xIndex = xIndexLeft;
    }

    const yValueCursor = yScale.invert(position[1]);

    const yBisector = d3.bisector(e => { return y0(values(e)[xIndex]) + y(values(e)[xIndex]); }).left;
    let yIndex = yBisector(d, yValueCursor);
    yIndex = (yIndex === d.length) ? yIndex - 1: yIndex;

    const yValue = y(values(d[yIndex])[xIndex]);
    const yValueCumulative = y0(values(d[d.length - 1])[xIndex]) + y(values(d[d.length - 1])[xIndex]);

    const xValue = x(values(d[yIndex])[xIndex]);

    const xPos = xScale(xValue);
    const yPos = yScale(y0(values(d[yIndex])[xIndex]) + yValue);

    return [this.props.tooltipHtml(yValue, yValueCumulative, xValue), xPos, yPos];
  }

  render() {
    const {
      height,
      legend,
      width,
      margin,
      colorScale,
      interpolate,
      stroke,
      values,
      label,
      x,
      y,
      y0,
      xAxis,
      yAxis
    } = this.props;

    const [
      data,
      innerWidth,
      innerHeight,
      xScale,
      yScale,
      //xIntercept,
      //yIntercept
    ] = [
      this._data,
      this._innerWidth,
      this._innerHeight,
      this._xScale,
      this._yScale,
      //this._xIntercept,
      //this._yIntercept
    ];

    const line = d3.svg.line()
      .x(function(e) { return xScale(x(e)); })
      .y(function(e) { return yScale(y0(e) + y(e)); })
      .interpolate(interpolate);

    const area = d3.svg.area()
      .x(function(e) { return xScale(x(e)); })
      .y0(function(e) { return yScale(yScale.domain()[0] + y0(e)); })
      .y1(function(e) { return yScale(y0(e) + y(e)); })
      .interpolate(interpolate);

    const areas = data.map((stack, index) => {
      return (
        <Path key={`${label(stack)}.${index}`}
              className='area'
              stroke='none'
              fill={colorScale(label(stack))}
              d={area(values(stack))}
              onMouseMove={this.handleMouseMove.bind(this)}
              onMouseLeave={this.handleMouseLeave.bind(this)}
              data={data}
        />
      );
    });

    data.map(stack => {
      return (
        <Path className='line'
              d={line(values(stack))}
              stroke={stroke(label(stack))}
              data={data}
        />);
    });

    return (
      <div>
        <Chart className={ this.props.className } height={height} width={width} margin={margin} legend={legend}>
          <g>{areas}</g>
          <Axis className={'x axis'} orientation={'bottom'} scale={xScale} height={innerHeight} width={innerWidth} {...xAxis} />
          <Axis className={'y axis'} orientation={'left'} scale={yScale} height={innerHeight} width={innerWidth} {...yAxis} />
          { this.props.children }
        </Chart>
        <Tooltip {...this.state.tooltip} className={ this.props.tooltipClassName } />
      </div>
    );
  }

}

export default AreaChart;
