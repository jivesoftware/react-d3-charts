import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import d3 from 'd3/d3.min.js';
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
      nodes: _.clone(this.props.data.nodes),
      tooltip: {
        hidden: true
      }
    };
  }

  componentDidMount() {
    this._svg_node = ReactDOM.findDOMNode(this).getElementsByTagName('svg')[0];
    const self = this;
    this._drag = d3.behavior.drag().on('drag', function() { self._handleDrag(this, d3.event.dx, d3.event.dy); });
    this._setupDrag();
  }

  componentWillMount() {
    helpers.calculateInner(this, this.props);
    helpers.addTooltipMouseHandlers(this);
  }

  componentWillReceiveProps(nextProps) {
    helpers.calculateInner(this, nextProps);
    const tooltip = this.state.tooltip;
    this.setState({
      nodes: _.clone(nextProps.data.nodes),
      tooltip: tooltip
    });
  }

  componentDidUpdate(){
    this._setupDrag();
  }

  _tooltipHtml(nodeIndex, position) {
    const len = this.state.nodes.length;
    let node = { name: '', value: '' };
    if (nodeIndex > -1 && nodeIndex < len){
      node = this.state.nodes[nodeIndex];
    }
    const html = this.props.tooltipHtml(node.name, node.value, position);
    return [html, 0, 0];
  }


  _setupDrag(){
    setTimeout(() => {
      const nodes = d3.selectAll('.node');
      nodes.call(this._drag);
    }, 100);
  }

  _handleDrag(node, dx, dy){
    const nodeIndex = node.getAttribute('data-node-index');
    const nodes = this.state.nodes;
    const len = nodes.length;
    if (nodeIndex > -1 && nodeIndex < len){
      nodes[nodeIndex].x += dx;
      nodes[nodeIndex].y += dy;
      const tooltip = this.state.tooltip;
      this.setState({
        drag: {
          nodes: this.state.nodes,
          tooltip: tooltip
        }
      });
    }
  }

  _findNode(link, field) {
    const results = this.state.nodes.filter(function(d, i){
      return i === link[field];
    });
    if (results.length > 0){
      return results.shift();
    }
    return null;
  }

  render() {
    const {
      width,
      height,
      legend,
      margin,
      colorScale
    } = this.props;

    let links = [];
    let nodes = [];

    if (_.isArray(this.state.nodes) && this.state.nodes.length > 0 && _.isArray(this.props.data.links) && this.props.data.links.length > 0){

      links = this.props.data.links.map((link, index) => {
        const source = this._findNode(link, 'source');
        const  target = this._findNode(link, 'target');
        return (
          <line
            key={`${link.source}.${link.target}.${index}`}
            className='link'
            fill='none'
            stroke='black'
            x1={ source.x }
            y1={ source.y }
            x2={ target.x }
            y2={ target.y }
          />
        );
      });

      nodes = this.state.nodes.map((node, index) => {
        return (
          <circle
            key={`${node.name}.${index}`}
            className='node'
            fill={ colorScale(index) }
            cx={ node.x }
            cy={ node.y }
            r={ 15 }
            data-node-index={index}
            onMouseMove={ (evt) => {
              this.handleMouseMove(evt, index);
            }}
            onMouseLeave={this.handleMouseLeave.bind(this)}
          />
        );
      });
    }

    return (
      <div>
        <Chart className={ this.props.className } height={height} width={width} margin={margin} legend={legend} >
          {links}
          {nodes}
          { this.props.children }
        </Chart>
        <Tooltip {...this.state.tooltip} className={ this.props.tooltipClassName } />
      </div>
    );
  }
}

export default NodeChart;

