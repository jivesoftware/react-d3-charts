import React, { PropTypes, Component } from 'react';
import d3 from 'd3/d3.min.js';
import Chart from './Chart';
import Axis from './Axis';
import Bar from './Bar';
import Tooltip from './Tooltip';
import * as helpers from './helpers.js';
//import _ from 'lodash';
import ReactDOM from 'react-dom';


class DataSet extends Component {

  static propTypes = {
    data: PropTypes.array.isRequired,
    xScale: PropTypes.func.isRequired,
    yScale: PropTypes.func.isRequired,
    colorScale: PropTypes.func.isRequired,
    values: PropTypes.func.isRequired,
    label: PropTypes.func.isRequired,
    x: PropTypes.func.isRequired,
    y: PropTypes.func.isRequired,
    y0: PropTypes.func.isRequired,
    onMouseMove: PropTypes.func,
    onMouseLeave: PropTypes.func
  };

  render() {
    const {
      data,
      xScale,
      yScale,
      colorScale,
      values,
      label,
      x,
      y,
      y0,
      onMouseMove,
      onMouseLeave,
      groupedBars} = this.props;

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
              onMouseMove={onMouseMove}
              onMouseLeave={onMouseLeave}
              />
              );
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
              onMouseMove={onMouseMove}
              onMouseLeave={onMouseLeave}
              />
              );
        });
      });
    }

    return (
        <g>{bars}</g>
        );
  }
}

class BarChart extends Component {

  static propTypes = {
    barPadding: PropTypes.number,
    children: PropTypes.arrayOf(PropTypes.object),
    colorScale: PropTypes.func,
    data: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.array
    ]).isRequired,
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
    xScale: PropTypes.func,
    y: PropTypes.func,
    y0: PropTypes.func,
    yScale: PropTypes.func
  };

  static defaultProps = {
    barPadding: 0.5,
    colorScale: d3.scale.category20(),
    data: {label: 'No data available', values: [{x: 'No data available', y: 1}]},
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
    for(i=0; i<dataLen; ++i){
      datum = this._data[i];
      valuesLen = datum.values.length;
      for(j=0; j<valuesLen; ++j){
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

  handleMouseMove(e, data) {
    if (!this.props.tooltipHtml) {
      return;
    }

    e.preventDefault();

    const {
      margin,
      tooltipMode,
      tooltipOffset,
      tooltipContained
    } = this.props;

    const svg = this._svg_node;
    let position;
    if (svg.createSVGPoint) {
      let point = svg.createSVGPoint();
      point.x = e.clientX;
      point.y = e.clientY;
      point = point.matrixTransform(svg.getScreenCTM().inverse());
      position = [point.x - margin.left, point.y - margin.top];
    } else {
      const rect = svg.getBoundingClientRect();
      position = [e.clientX - rect.left - svg.clientLeft - margin.left,
      e.clientY - rect.top - svg.clientTop - margin.top];
    }

    const [html, xPos, yPos] = this._tooltipHtml(data, position);
    const svgTop = svg.getBoundingClientRect().top + margin.top;
    const svgLeft = svg.getBoundingClientRect().left + margin.left;

    let top = 0;
    let left = 0;

    if (tooltipMode === 'fixed') {
      top = svgTop + tooltipOffset.top;
      left = svgLeft + tooltipOffset.left;
    } else if (tooltipMode === 'element') {
      top = svgTop + yPos + tooltipOffset.top;
      left = svgLeft + xPos + tooltipOffset.left;
    } else { // mouse
      top = e.clientY + tooltipOffset.top;
      left = e.clientX + tooltipOffset.left;
    }

    function lerp(t, a, b) {
      return (1 - t) * a + t * b;
    }

    let translate = 50;

    if (tooltipContained) {
      const t = position[0] / svg.getBoundingClientRect().width;
      translate = lerp(t, 0, 100);
    }

    this.setState({
      tooltip: {
        top: top,
        left: left,
        hidden: false,
        html: html,
        translate: translate
      }
    });
  }

  handleMouseLeave(e) {
    if (!this.props.tooltipHtml) {
      return;
    }

    e.preventDefault();

    this.setState({
      tooltip: {
        hidden: true
      }
    });
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
    this._yScale];

    return (
      <div>
        <Chart className='chart' height={height} width={width} margin={margin} legend={legend}>
          <Axis className={'x axis'} orientation={'bottom'} scale={xScale} height={innerHeight} width={innerWidth} {...xAxis} />
          <Axis className={'y axis'} orientation={'left'} scale={yScale} height={innerHeight} width={innerWidth} {...yAxis} />
          <DataSet
            data={data}
            xScale={xScale}
            yScale={yScale}
            colorScale={colorScale}
            values={values}
            label={label}
            y={y}
            y0={y0}
            x={x}
            onMouseMove={this.handleMouseMove.bind(this)}
            onMouseLeave={this.handleMouseLeave.bind(this)}
            groupedBars={groupedBars}
          />
          { this.props.children }
        </Chart>
        <Tooltip {...this.state.tooltip} className={ this.props.tooltipClassName } />
      </div>
    );
  }

}

export default BarChart;
