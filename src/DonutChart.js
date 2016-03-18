import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import d3 from 'd3/d3.min.js';
import Chart from './Chart';
import Tooltip from './Tooltip';
import * as helpers from './helpers.js';
//import _ from 'lodash';

class DonutChart extends Component {

  static propTypes = {
    children: PropTypes.arrayOf(PropTypes.object),
    colorScale: PropTypes.func,
    cornerRadius: PropTypes.number,
    data: PropTypes.oneOfType([ PropTypes.object, PropTypes.array ]).isRequired,
    height: PropTypes.number.isRequired,
    innerRadius: PropTypes.number,
    label: PropTypes.func,
    labelRadius: PropTypes.number,
    legend: PropTypes.object,
    outerRadius: PropTypes.number,
    margin: PropTypes.shape({
      top: PropTypes.number,
      bottom: PropTypes.number,
      left: PropTypes.number,
      right: PropTypes.number
    }),
    padRadius: PropTypes.string,
    sort: PropTypes.any,
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
    className: 'chart',
    colorScale: d3.scale.category20(),
    data: {label: 'No data available', values: [{x: 'No data available', y: 1}]},
    innerRadius: null,
    label: stack => { return stack.label; },
    margin: {top: 0, bottom: 0, left: 0, right: 0},
    outerRadius: null,
    labelRadius: null,
    padRadius: 'auto',
    cornerRadius: 0,
    sort: undefined,
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

  _tooltipHtml(d) {
    const html = this.props.tooltipHtml(this.props.x(d), this.props.y(d));
    return [html, 0, 0];
  }

  _midAngle(d){
    return d.startAngle + (d.endAngle - d.startAngle)/2;
  }

  render() {

    const {
      width,
      height,
      margin,
      colorScale,
      padRadius,
      cornerRadius,
      sort,
      x,
      y,
      values
    } = this.props;

    const [
      data,
      innerWidth,
      innerHeight,
    ] = [
      this._data,
      this._innerWidth,
      this._innerHeight
    ];

    let innerRadius = this.props.innerRadius;
    let outerRadius = this.props.outerRadius;
    let labelRadius = this.props.labelRadius;

    let pie = d3.layout.pie().value(e => { return y(e); });

    if (typeof sort !== 'undefined') {
      pie = pie.sort(sort);
    }

    const radius = Math.min(innerWidth, innerHeight) / 2;
    if (!innerRadius) {
      innerRadius = radius * 0.8;
    }

    if (!outerRadius) {
      outerRadius = radius * 0.4;
    }

    if (!labelRadius) {
      labelRadius = radius * 0.9;
    }

    const arc = d3.svg.arc().innerRadius(innerRadius).outerRadius(outerRadius).padRadius(padRadius).cornerRadius(cornerRadius);

    const outerArc = d3.svg.arc().innerRadius(labelRadius).outerRadius(labelRadius);

    console.log('data:', JSON.stringify(data, undefined, 2));
    const pieData = pie(values(data));

    const translation = `translate(${innerWidth/2}, ${innerHeight/2})`;

    const strokeWidth = 2;
		const stroke = '#000';
    const fill = 'none';
		const opacity = 0.3;

    const wedges = pieData.map((e, index) => {

      const d = arc(e);

      const labelPos = outerArc.centroid(e);
      labelPos[0] = radius * (this._midAngle(e) < Math.PI ? 1 : -1);

      const textAnchor = this._midAngle(e) < Math.PI ? 'start' : 'end';

      const linePos = outerArc.centroid(e);
      linePos[0] = radius * 0.95 * (this._midAngle(e) < Math.PI ? 1 : -1);

      return (
        <g key={`${x(e.data)}.${y(e.data)}.${index}`} className='arc'>
          <path fill={colorScale(x(e.data))} d={d} onMouseMove={ evt => {this.onMouseEnter(evt, e.data); } } onMouseLeave={  evt => { this.onMouseLeave(evt); } } />
          <polyline opacity={opacity} strokeWidth={strokeWidth} stroke={stroke} fill={fill} points={[arc.centroid(e), outerArc.centroid(e), linePos]} />
          <text dy='.35em' x={labelPos[0]} y={labelPos[1]} textAnchor={textAnchor}>{x(e.data)}</text>
        </g>
      );
    });

    return (
      <div>
        <Chart height={height} width={width} margin={margin}>
          <g transform={translation}>
            <g>{wedges}</g>
          </g>
          { this.props.children }
        </Chart>
        <Tooltip {...this.state.tooltip}/>
      </div>
    );
  }
}

export default DonutChart;
