import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import d3 from 'd3/d3.min.js';
import Chart from './Chart';
import Tooltip from './Tooltip';
import * as helpers from './helpers.js';
import _ from 'lodash';
import shortid from 'shortid';

class NodeChart extends Component {

  static propTypes = {
    children: PropTypes.oneOfType([ PropTypes.object, PropTypes.array ]),
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
    defaultNodeRadius: PropTypes.number,
    maxNodeRadius: PropTypes.number,
    minNodeRadius: PropTypes.number,
    labelNodes: PropTypes.bool,
    onNodeClick: PropTypes.func,
    scaleNodesByValue: PropTypes.bool,
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
    defaultNodeRadius: 15,
    maxNodeRadius: 50,
    minNodeRadius: 10,
    scaleNodesByValue: false,
    labelNodes: true,
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

    this.uniqueId = shortid.generate();
    this.state = {
      tree: this._buildTree(props),
      tooltip: {
        hidden: true
      }
    };
  }

  componentDidMount() {
    const svgs = ReactDOM.findDOMNode(this).getElementsByTagName('svg');
    this._svg_node = svgs[0];
    const self = this;
    this._drag = d3.behavior.drag().on('drag', function() {
      const evt = d3.event;
      if (evt.sourceEvent.buttons || evt.type === 'drag'){
        self._handleDrag(this, evt.dx, evt.dy);
      }
    });

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

  _radial(center, radius, scaleRadius, len){
    return function(node, index){
      const D2R = Math.PI / 180;
      const startAngle = 90;
      const displacement = (len-1)>=12 ? 30 : 360/(len-1);
      const currentAngle = startAngle + (displacement * index);
      const currentAngleRadians = currentAngle * D2R;
      const radialPoint = {
        x: center.x + radius * Math.cos(currentAngleRadians),
        y: center.y + radius * Math.sin(currentAngleRadians)
      };
      node.x += (radialPoint.x - node.x);
      node.y += (radialPoint.y - node.y);
      if (scaleRadius){
        node.radius = scaleRadius(node.value);
        //console.log('assigned node', node.value, node.radius);
      }
    };
  }

  _values(nodes) {
    const nodeValues = [];
    _.forEach(nodes, function(node){
      nodeValues.push(node.value);
    });
    nodeValues.sort(function(a, b){
      return b - a;
    });
    //console.log('sorted', nodeValues, nodeValues.length);
    return nodeValues;
  }

  _makeScale(nodeValues, minNodeRadius, maxNodeRadius, defaultNodeRadius) {
    const largestNodeRadius = nodeValues[0];
    const smallestNodeRadius = nodeValues[nodeValues.length - 1];
    const rangeSize = largestNodeRadius - smallestNodeRadius;
    if (rangeSize > 0){
      return function(value){
        const adjustedValue = value - smallestNodeRadius;
        return minNodeRadius + Math.floor((maxNodeRadius/rangeSize) * adjustedValue);
      };
    }
    return function(){
      return defaultNodeRadius;
    };
  }

  _collide(node) {
    const nr = node.radius,
      nx1 = node.x - nr,
      nx2 = node.x + nr,
      ny1 = node.y - nr,
      ny2 = node.y + nr;
    return function(quad, x1, y1, x2, y2) {
      if (quad.point && (quad.point !== node)) {
        let x = node.x - quad.point.x;
        let y = node.y - quad.point.y;
        let l = Math.sqrt(x * x + y * y);
        const r = node.radius + quad.point.radius;
        if (l < r) {
          l = (l - r) / l;
          node.x -= x *= l;
          node.y -= y *= l;
          quad.point.x += x;
          quad.point.y += y;
        }
      }
      return x1 > nx2
          || x2 < nx1
          || y1 > ny2
          || y2 < ny1;
    };
  }

  _buildTree(props){
    if (!props){
      return {};
    }

    const innerWidth = props.width - props.margin.left - props.margin.right;
    const innerHeight = props.height - props.margin.top - props.margin.bottom;
    const center = {
      x: innerWidth / 2,
      y: innerHeight / 2
    };

    const diameter = Math.min(innerHeight, innerWidth);
    const size = [innerWidth, innerHeight];
    const tree = d3.layout.tree().size(size);
    const nodes = tree.nodes(_.cloneDeep(props.data));
    let i, scaleRadius;

    if (props.scaleNodesByValue){
      const nodeValues = this._values(nodes);
      if (nodeValues.length > 0){
        scaleRadius = this._makeScale(nodeValues, props.minNodeRadius, props.maxNodeRadius, props.defaultNodeRadius);
      }
    }

    let chartRadius = (diameter / 2);

    if (props.layout === 'radial'){
      const len = nodes.length;
      let radial = this._radial(center, chartRadius, scaleRadius, len, props.width, props.height);

      //put the first node in the center
      nodes[0].x = center.x;
      nodes[0].y = center.y;
      nodes[0].radius = scaleRadius ? scaleRadius(nodes[0].value) : props.defaultNodeRadius;

      //distribute the around the center like the hours on a clock
      for (i = 1; i < len; ++i){
        if (((i-1) % 12) === 0){
          //distribute the next go round with a shorter radius
          chartRadius = Math.max(0, chartRadius) - (chartRadius * 0.25) - props.innerNodeOffset;
          radial = this._radial(center, chartRadius, scaleRadius, len, props.width, props.height);
        }
        nodes[i].radius = props.defaultNodeRadius;
        radial(nodes[i], i, scaleRadius);
      }

      //detect and fix collisions
      const q = d3.geom.quadtree(nodes);
      i = 0;
      while (++i < len) {
        q.visit(this._collide(nodes[i]));
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
    const tooltip = { hidden: true };
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

  _handleClick(evt, node){
    if (_.isPlainObject(this.state.tooltip) && _.isBoolean(this.state.tooltip.hidden) && (!this.state.tooltip.hidden)){
      //tooltips are hidden when dragging so we only register a click if not dragging
      if (this.props.onNodeClick){
        this.props.onNodeClick(evt, node);
      }
    }
  }

  _createLink(link, index){
    return (
      <line
        key={`${this.uniqueId}.${link.source}.${link.target}.${index}`}
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

  _imageId(index){
    return `${this.uniqueId}-node-image-${index}`;
  }

  _createPattern(node, index){
    const hasImage = _.isString(node.imageUrl);
    if (hasImage){
      return (
        <pattern key={ this._imageId(index) } id={ this._imageId(index) } height='100%' width='100%' x='0' patternUnits='userSpaceOnUse' y='0'>
          <image
            x={ node.x - node.radius }
            y={ node.y - node.radius }
            height={ node.radius * 2 }
            width={ node.radius * 2 }
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
        key={ `${this.uniqueId}.${node.name}.${index}` }
        className='node'
        fill={ hasImage ? 'url(#'+ this._imageId(index) + ')' : this.props.colorScale(index) }
        cx={ node.x }
        cy={ node.y }
        r={ node.radius }
        data-node-index={index}
        onClick={ (evt) => {
          this._handleClick(evt, node);
        }}
        onMouseMove={ (evt) => {
          this.handleMouseMove(evt, node);
        }}
        onMouseLeave={this.handleMouseLeave.bind(this)}
      />
    );
  }

  _createLabels(node, index){
    if (node.hideLabel){
      return null;
    }
    return (
      <text
        key={ `${this.uniqueId}.${node.name}.${index}` }
        x={ node.x }
        y={ node.y }
        dy={ '0.35em' }
        textAnchor='middle'>
        { node.label || node.name }
      </text>
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
    let labels = [];

    const tree = this.state.tree;
    if (tree && _.isArray(tree.nodes) && tree.nodes.length > 0 && _.isArray(tree.links) && tree.links.length > 0){
      links = tree.links.map(this._createLink.bind(this));
      patterns = _.compact(tree.nodes.map(this._createPattern.bind(this)));
      nodes = tree.nodes.map(this._createNode.bind(this));
      if (this.props.labelNodes){
        labels = _.compact(tree.nodes.map(this._createLabels.bind(this)));
      }
    }

    return (
      <div>
        <Chart className={ this.props.className } height={height} width={width} margin={margin} legend={legend} defs={patterns} >
          {links}
          {nodes}
          {labels}
          { this.props.children }
        </Chart>
        <Tooltip {...this.state.tooltip} className={ this.props.tooltipClassName } />
      </div>
    );
  }
}

export default NodeChart;

