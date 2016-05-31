import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import d3 from 'd3/d3.min.js';
import Chart from './Chart';
import Path from './Path';
import Tooltip from './Tooltip';
import * as helpers from './helpers.js';
import _ from 'lodash';

class DonutChart extends Component {

  static propTypes = {
    children: PropTypes.oneOfType([ PropTypes.object, PropTypes.array ]),
    className: PropTypes.string,
    colorScale: PropTypes.func,
    cornerRadius: PropTypes.number,
    data: PropTypes.oneOfType([ PropTypes.object, PropTypes.array ]).isRequired,
    height: PropTypes.number.isRequired,
    innerRadius: PropTypes.number,
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
    yScale: PropTypes.func
  };

  static defaultProps = {
    className: 'chart',
    colorScale: d3.scale.category20(),
    data: [],
    innerRadius: null,
    margin: {top: 0, bottom: 0, left: 0, right: 0},
    outerRadius: null,
    padRadius: 'auto',
    cornerRadius: 0,
    sort: undefined,
    tooltipMode: 'mouse',
    tooltipOffset: {top: -35, left: 0},
    tooltipClassName: null,
    tooltipHtml: null,
    tooltipContained: false,
    values: stack => {
      return stack.values;
    },
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
    //helpers.arrayify(this, this.props);
    helpers.makeScales(this, this.props);
    helpers.addTooltipMouseHandlers(this);
  }

  componentWillReceiveProps(nextProps) {
    helpers.calculateInner(this, nextProps);
    //helpers.arrayify(this, nextProps);
    helpers.makeScales(this, nextProps);
  }

  _tooltipHtml(d) {
    const html = this.props.tooltipHtml(d.x, d.y);
    return [html, 0, 0];
  }

  _midAngle(d){
    return d.startAngle + (d.endAngle - d.startAngle)/2;
  }

  render() {
    const {
      data,
      width,
      height,
      legend,
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
      innerWidth,
      innerHeight,
    ] = [
      this._innerWidth,
      this._innerHeight
    ];

    let innerRadius = this.props.innerRadius;
    let outerRadius = this.props.outerRadius;

    let pie = d3.layout.pie().value(e => {
      return y(e);
    });

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

    const translation = `translate(${innerWidth/2}, ${innerHeight/2})`;
    let wedges;

    if (_.isPlainObject(data) && _.isArray(data.values) && data.values.length > 0){
      const arc = d3.svg.arc().innerRadius(innerRadius).outerRadius(outerRadius).padRadius(padRadius).cornerRadius(cornerRadius);
      const vals = values(data);

      const pieData = pie(vals);

      wedges = pieData.map((e, index) => {
        const d = arc(e);
        return (
          <Path
            key={`${x(e.data)}.${y(e.data)}.${index}`}
            className='arc'
            stroke='none'
            fill={colorScale(x(e.data))}
            d={d}
            onMouseMove={ (evt) => {
              this.handleMouseMove(evt, e.data);
            }}
            onMouseLeave={this.handleMouseLeave.bind(this)}
            data={data}
          />
        );
      });
    }

    return (
      <div>
        <Chart className={ this.props.className } height={height} width={width} margin={margin} legend={legend}>
          <g transform={translation}>
            <g>{wedges}</g>
          </g>
          { this.props.children }
        </Chart>
        <Tooltip {...this.state.tooltip} className={ this.props.tooltipClassName } />
      </div>
    );
  }
}

export default DonutChart;
