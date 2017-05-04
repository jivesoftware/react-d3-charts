import React, { PropTypes, Component } from 'react';
import d3 from 'd3/d3.min.js';
import Chart from './Chart';
import Axis from './Axis';
import Bar from './Bar';
import Tooltip from './Tooltip';
import * as helpers from './helpers.js';
import ReactDOM from 'react-dom';

class BarChart extends Component {

  static propTypes = {
    barPadding: PropTypes.number,
    children: PropTypes.oneOfType([ PropTypes.object, PropTypes.array ]),
    className: PropTypes.string,
    colorScale: PropTypes.func,
    data: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.array
    ]).isRequired,
    groupedBars: PropTypes.bool,
    height: PropTypes.number.isRequired,
    label: PropTypes.func,
    legend: PropTypes.object,
    margin: PropTypes.shape({
      top: PropTypes.number,
      bottom: PropTypes.number,
      left: PropTypes.number,
      right: PropTypes.number
    }),
    offset: PropTypes.string,
    tooltipHtml: PropTypes.func,
    tooltipMode: PropTypes.oneOf(['mouse', 'element', 'fixed']),
    tooltipClassName: PropTypes.string,
    tooltipContained: PropTypes.bool,
    tooltipOffset: PropTypes.objectOf(PropTypes.number),
    values: PropTypes.func,
    width: PropTypes.number.isRequired,
    x: PropTypes.func,
    xAxis: PropTypes.object,
    xScale: PropTypes.func,
    y: PropTypes.func,
    yAxis: PropTypes.object,
    y0: PropTypes.func,
    yScale: PropTypes.func
  };

  static defaultProps = {
    barPadding: 0.5,
    className: 'chart',
    colorScale: d3.scale.category20(),
    data: {label: 'No data available', values: [{x: 'No data available', y: 1}]},
    groupedBars: false,
    label: stack => { return stack.label; },
    margin: {top: 0, bottom: 0, left: 0, right: 0},
    offset: 'zero',
    order: 'default',
    tooltipMode: 'mouse',
    tooltipOffset: {top: -35, left: 0},
    tooltipClassName: null,
    tooltipHtml: null,
    tooltipContained: false,
    values: stack => { return stack.values; },
    x: e => { return e.x; },
    xScale: null,
    y: e => { return e.y; },
    y0: e => { return e.y0; },
    yScale: null
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
    this._stackData(this.props);
    helpers.makeScales(this, this.props);
    helpers.addTooltipMouseHandlers(this);
  }

  componentWillReceiveProps(nextProps) {
    helpers.calculateInner(this, nextProps);
    helpers.arrayify(this, nextProps);
    this._stackData(nextProps);
    helpers.makeScales(this, nextProps);
  }

  _stackData(props) {
    const { offset, order, x, y, values } = props;

    const stack = d3.layout.stack()
      .offset(offset)
      .order(order)
      .x(x)
      .y(y)
      .values(values);

    this._data = stack(this._data);
  }

  _tooltipHtml(d /*, position*/) {
    const xScale = this._xScale;
    const yScale = this._yScale;

    const x = this.props.x(d);
    const y0 = this.props.y0(d);

    let i, j;
    const midPoint = xScale.rangeBand() / 2;
    const xPos = midPoint + xScale(x);

    const topStack = this._data[this._data.length - 1].values;
    let topElement = null;

    for (i = 0; i < topStack.length; i++) {
      if (this.props.x(topStack[i]) === x) {
        topElement = topStack[i];
        break;
      }
    }
    const yPos = yScale(this.props.y0(topElement) + this.props.y(topElement));

    let datum, value, total, valuesLen, dataLabel;
    const dataLen = this._data.length;
    total = 0;
    for (i=0; i<dataLen; ++i){
      datum = this._data[i];
      valuesLen = datum.values.length;
      for (j=0; j<valuesLen; ++j){
        value = datum.values[j];
        if (value.x === x){
          total += value.y;
          if (value.y0 === y0){
            dataLabel = datum.label;
          }
        }
      }//end for
    }//end for

    const html = this.props.tooltipHtml(this.props.x(d), this.props.y0(d), this.props.y(d), total, dataLabel);

    return [html, xPos, yPos];
  }

  render() {
    const {
      height,
      width,
      margin,
      colorScale,
      values,
      label,
      y,
      y0,
      x,
      xAxis,
      yAxis,
      groupedBars,
      legend
    } = this.props;

    const [
      data,
      innerWidth,
      innerHeight,
      xScale,
      yScale
    ] = [this._data,
      this._innerWidth,
      this._innerHeight,
      this._xScale,
      this._yScale
    ];

    let bars;
    if (groupedBars) {
      bars = data.map((stack, serieIndex) => {
        return values(stack).map((e, index) => {
          return (
            <Bar
              key={`${label(stack)}.${index}`}
              width={xScale.rangeBand() / data.length}
              height={yScale(yScale.domain()[0]) - yScale(y(e))}
              x={xScale(x(e)) + ((xScale.rangeBand() * serieIndex) / data.length)}
              y={yScale(y(e))}
              fill={colorScale(label(stack))}
              data={e}
              onMouseMove={this.handleMouseMove.bind(this)}
              onMouseLeave={this.handleMouseLeave.bind(this)}
            />);
        });
      });
    } else {
      bars = data.map(stack => {
        return values(stack).map((e, index) => {
          return (
            <Bar
              key={`${label(stack)}.${index}`}
              width={xScale.rangeBand()}
              height={yScale(yScale.domain()[0]) - yScale(y(e))}
              x={xScale(x(e))}
              y={yScale(y0(e) + y(e))}
              fill={colorScale(label(stack))}
              data={e}
              onMouseMove={this.handleMouseMove.bind(this)}
              onMouseLeave={this.handleMouseLeave.bind(this)}
            />);
        });
      });
    }

    return (
      <div>
        <Chart className={ this.props.className } height={height} width={width} margin={margin} legend={legend}>
          <Axis className={'x axis'} orientation={'bottom'} scale={xScale} height={innerHeight} width={innerWidth} {...xAxis} />
          <Axis className={'y axis'} orientation={'left'} scale={yScale} height={innerHeight} width={innerWidth} {...yAxis} />
          <g>{bars}</g>
          { this.props.children }
        </Chart>
        <Tooltip {...this.state.tooltip} className={ this.props.tooltipClassName } />
      </div>
    );
  }

}

export default BarChart;
