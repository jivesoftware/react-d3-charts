import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import d3 from 'd3'; //'d3/d3.min.js';
import Chart from './Chart';
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
      drag: null
    };
  }

  componentDidMount() {
    this._svg_node = ReactDOM.findDOMNode(this).getElementsByTagName('svg')[0];
  }

  componentWillMount() {
    helpers.calculateInner(this, this.props);
  }

  componentWillReceiveProps(nextProps) {
    helpers.calculateInner(this, nextProps);
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

  _nodePosition(e){
    const dim = e.target.getBoundingClientRect();
    const x = e.clientX - dim.left;
    const y = e.clientY - dim.top;
    return { x, y };
  }

  _startDrag(e){
    // only left mouse button
    if (e.button !== 0){
      return;
    }
    const nodeIndex = parseInt(e.target.getAttribute('data-node-index'), 10);
    if (_.isNumber(nodeIndex)){
      const state = {
        drag: _.assign(this.state.drag, this._nodePosition(e))
      };
      state.drag.nodeIndex = nodeIndex;
      this.setState(state);
    }
  }

  _stopDrag(e){
    if (!this.state.drag){
      return;
    }
    if (_.isNumber(this.state.drag.nodeIndex)){
      const nodeIndex = this.state.drag.nodeIndex;
      const len = this.props.data.nodes.length;
      if (nodeIndex > -1 && nodeIndex < len){
        const node = this.props.data.nodes[nodeIndex];
        _.assign(node, this._nodePosition(e));
      }
    }
    this.setState({
      drag: null
    });
  }

  handleMouseMove(e) {
    if (!this.state.drag){
      return;
    }
    this.setState({
      drag: _.assign(this.state.drag, this._nodePosition(e))
    });
    e.stopPropagation();
    e.preventDefault();
  }

  handleMouseLeave(e) {
    if (!this.state.drag){
      return;
    }
    this._stopDrag(e);
    e.stopPropagation();
    e.preventDefault();
  }

  handleMouseDown(e) {
    if (this.state.drag){
      this._stopDrag(e);
    }
    // only left mouse button
    if (e.button !== 0){
      return;
    }
    this._startDrag(e);

    e.stopPropagation();
    e.preventDefault();
  }

  handleMouseUp(e) {
    if (!this.state.drag){
      return;
    }
    this._stopDrag(e);
    e.stopPropagation();
    e.preventDefault();
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
        let sourceX, sourceY, targetX, targetY;
        const source = this._findNode(link, 'source');
        const  target = this._findNode(link, 'target');
        sourceX = source.x;
        sourceY = source.y;
        targetX = target.x;
        targetY = target.y;
        if (this.state.drag){
          if (link.source === this.state.drag.nodeIndex){
            sourceX = this.state.drag.x;
            sourceY = this.state.drag.y;
          }
          if (target.source === this.state.drag.nodeIndex){
            targetX = this.state.drag.x;
            targetY = this.state.drag.y;
          }
        }
        return (
          <line
            key={`${link.source}.${link.target}.${index}`}
            className='link'
            fill='none'
            stroke='black'
            x1={ sourceX }
            y1={ sourceY }
            x2={ targetX }
            y2={ targetY }
          />
        );
      });

      nodes = data.nodes.map((node, index) => {
        let x = node.x;
        let y = node.y;
        console.log(index, 'this.state.drag', this.state.drag);
        if (this.state.drag && index === this.state.drag.nodeIndex){
          x = this.state.drag.x;
          y = this.state.drag.y;
        }
        return (
          <circle
            key={`${node.name}.${index}`}
            className='circle'
            fill={ colorScale(index) }
            cx={ x }
            cy={ y }
            r={ 15 }
            data-node-index={index}
          />
        );
      });
    }

    return (
      <div onMouseDown={ this.handleMouseDown.bind(this) } onMouseUp={ this.handleMouseUp.bind(this) } onMouseMove={ this.handleMouseMove.bind(this) } onMouseLeave={this.handleMouseLeave.bind(this)} >
        <Chart className={ this.props.className } height={height} width={width} margin={margin} legend={legend} >
          {links}
          {nodes}
          { this.props.children }
        </Chart>
      </div>
    );
  }
}

export default NodeChart;

