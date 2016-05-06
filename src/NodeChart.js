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
    innerNodeOffset: PropTypes.number,
    layout: PropTypes.string,
    legend: PropTypes.object,
    margin: PropTypes.shape({
      top: PropTypes.number,
      bottom: PropTypes.number,
      left: PropTypes.number,
      right: PropTypes.number
    }),
    nodeRadius: PropTypes.number,
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
    innerNodeOffset: 6,
    layout: 'radial',
    margin: {top: 0, bottom: 0, left: 0, right: 0},
    nodeRadius: 15,
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
      tree: this._buildTree(this.props),
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
      tree: this._buildTree(nextProps),
      tooltip: tooltip
    });
  }

  componentDidUpdate(){
    this._setupDrag();
  }

  _radial(center, radius){
    return function(node, index){
      const D2R = Math.PI / 180;
      const startAngle = 90;
      const currentAngle = startAngle + (30 * index);
      const currentAngleRadians = currentAngle * D2R;
      const radialPoint = {
        x: center.x + radius * Math.cos(currentAngleRadians),
        y: center.y + radius * Math.sin(currentAngleRadians)
      };
      node.x += (radialPoint.x - node.x);
      node.y += (radialPoint.y - node.y);
    };
  }

  _buildTree(props){
    const innerWidth = props.width - props.margin.left - props.margin.right;
    const innerHeight = props.height - props.margin.top - props.margin.bottom;
    const center = {
      x: innerWidth / 2,
      y: innerHeight / 2
    };
    const diameter = Math.min(innerHeight, innerWidth);
    let radius = (diameter / 2) - (this.props.nodeRadius);
    const size = [innerWidth, innerHeight];
    const tree = d3.layout.tree().size(size);
    const nodes = tree.nodes(this.props.data);
    if (this.props.layout === 'radial'){
      const len = nodes.length;
      let radial = this._radial(center, radius);

      //put the first node in the center
      nodes[0].x = center.x;
      nodes[0].y = center.y;

      //distribute the around the center like the hours on a clock
      for(let i = 1; i < len; ++i){
        if (((i-1) % 12) === 0){
          //distribute the next go round with a shorter radius
          radius = Math.max(0, radius - (this.props.nodeRadius * 2) - this.props.innerNodeOffset);
          radial = this._radial(center, radius);
        }
        radial(nodes[i], i);
      }
    }
    const links = tree.links(nodes);
    return {
      nodes: nodes,
      links: links
    };
  }

  _tooltipHtml(node, position) {
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
    const tree = this.state.tree;
    const nodes = tree.nodes;
    const tooltip = this.state.tooltip;
    const len = nodes.length;
    if (nodeIndex > -1 && nodeIndex < len){
      nodes[nodeIndex].x += dx;
      nodes[nodeIndex].y += dy;
      this.setState({
        tree: tree,
        tooltip: tooltip
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

  _createLink(link, index){
    return (
      <line
        key={`${link.source}.${link.target}.${index}`}
        className='link'
        fill='none'
        stroke='black'
        x1={ link.source.x }
        y1={ link.source.y }
        x2={ link.target.x }
        y2={ link.target.y }
      />
    );
  }

  _createPattern(node, index){
    const hasImage = _.isString(node.imageUrl);
    if (hasImage){
      return (
        <pattern key={ `node-image-${index}`} id={ `node-image-${index}`} height='100%' width='100%' x='0' patternUnits='userSpaceOnUse' y='0'>
          <image
            x={ node.x - this.props.nodeRadius }
            y={ node.y - this.props.nodeRadius }
            height={ this.props.nodeRadius * 2 }
            width={ this.props.nodeRadius * 2 }
            xlinkHref={ node.imageUrl }
          />
        </pattern>
      );
    }
    return '';
  }

  _createNode(node, index){
    const hasImage = _.isString(node.imageUrl);
    return (
      <circle
        key={`${node.name}.${index}`}
        className='node'
        fill={ hasImage ? `url(#node-image-${index})` : this.props.colorScale(index) }
        cx={ node.x }
        cy={ node.y }
        r={ this.props.nodeRadius }
        data-node-index={index}
        onMouseMove={ (evt) => {
          this.handleMouseMove(evt, node);
        }}
        onMouseLeave={this.handleMouseLeave.bind(this)}
      />
    );
  }

  render() {
    const {
      width,
      height,
      legend,
      margin
    } = this.props;

    let patterns = [];
    let links = [];
    let nodes = [];

    const tree = this.state.tree;
    if (_.isArray(tree.nodes) && tree.nodes.length > 0 && _.isArray(tree.links) && tree.links.length > 0){
      links = tree.links.map(this._createLink.bind(this));
      patterns = _.compact(tree.nodes.map(this._createPattern.bind(this)));
      nodes = tree.nodes.map(this._createNode.bind(this));
    }

    return (
      <div>
        <Chart className={ this.props.className } height={height} width={width} margin={margin} legend={legend} defs={patterns} >
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

