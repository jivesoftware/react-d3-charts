import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import d3 from 'd3'; //'d3/d3.min.js';
import Chart from './Chart';
import Tooltip from './Tooltip';
import * as helpers from './helpers.js';
import _ from 'lodash';

class NodeChart extends Component {

  static propTypes = {
    children: PropTypes.arrayOf(PropTypes.object),
    className: PropTypes.string,
    colorScale: PropTypes.func,
    data: PropTypes.oneOfType([ PropTypes.object, PropTypes.array ]).isRequired,
    height: PropTypes.number.isRequired,
    legend: PropTypes.object,
    margin: PropTypes.shape({
      top: PropTypes.number,
      bottom: PropTypes.number,
      left: PropTypes.number,
      right: PropTypes.number
    }),
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
    margin: {top: 0, bottom: 0, left: 0, right: 0},
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
    //helpers.makeScales(this, this.props);
    helpers.addTooltipMouseHandlers(this);
  }

  componentWillReceiveProps(nextProps) {
    helpers.calculateInner(this, nextProps);
    //helpers.arrayify(this, nextProps);
    //helpers.makeScales(this, nextProps);
  }

  _tooltipHtml(d) {
    const html = this.props.tooltipHtml(d.x, d.y);
    return [html, 0, 0];
  }

  _findNode(link, field) {
    const results = this.props.data.nodes.filter(function(d, i){
      return i === link[field];
    });
    if (results.length > 0){
      return results.shift();
    }
    return null;
  }

  render() {
    const {
      data,
      width,
      height,
      legend,
      margin,
      colorScale
    } = this.props;

    let links = [];
    let nodes = [];

    if (_.isPlainObject(data) && _.isArray(data.nodes) && data.nodes.length > 0 && _.isArray(data.links) && data.links.length > 0){

      links = data.links.map((link, index) => {
        return (
          <line
            key={`${link.source}.${link.target}.${index}`}
            className='link'
            fill='none'
            stroke='black'
            x1={ this._findNode(link, 'source').x }
            y1={ this._findNode(link, 'source').y }
            x2={ this._findNode(link, 'target').x }
            y2={ this._findNode(link, 'target').y }
          />
        );
      });

      nodes = data.nodes.map((node, index) => {
        return (
          <circle
            key={`${node.name}.${index}`}
            className='circle'
            fill={ colorScale(index) }
            cx={ node.x }
            cy={ node.y }
            r={ 15 }
          />
        );
      });
    }

    return (
      <div>
        <Chart className={ this.props.className } height={height} width={width} margin={margin} legend={legend}>
          {links}
          {nodes}
          { this.props.children }
        </Chart>
        <Tooltip {...this.state.tooltip}/>
      </div>
    );
  }
}

export default NodeChart;

