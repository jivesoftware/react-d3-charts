'use strict';

var React = require('react');

var Axis = React.createClass({
  displayName: 'Axis',

  propTypes: {
    height: React.PropTypes.number,
    width: React.PropTypes.number,
    tickArguments: React.PropTypes.array,
    tickValues: React.PropTypes.array,
    tickFormat: React.PropTypes.func,
    innerTickSize: React.PropTypes.number,
    tickPadding: React.PropTypes.number,
    outerTickSize: React.PropTypes.number,
    scale: React.PropTypes.func.isRequired,
    className: React.PropTypes.string,
    zero: React.PropTypes.number,
    orientation: React.PropTypes.oneOf(['top', 'bottom', 'left', 'right']).isRequired,
    label: React.PropTypes.string,
    staggerLabels: React.PropTypes.bool,
    gridLines: React.PropTypes.bool
  },

  getDefaultProps: function getDefaultProps() {
    return {
      tickArguments: [10],
      tickValues: null,
      tickFormat: null,
      innerTickSize: 6,
      tickPadding: 3,
      outerTickSize: 6,
      className: 'axis',
      zero: 0,
      label: '',
      staggerLabels: false,
      gridLines: false
    };
  },
  _getTranslateString: function _getTranslateString() {
    var _props = this.props;
    var orientation = _props.orientation;
    var height = _props.height;
    var width = _props.width;
    var zero = _props.zero;

    if (orientation === 'top') {
      return 'translate(0, ' + zero + ')';
    }
    if (orientation === 'bottom') {
      return 'translate(0, ' + (zero === 0 ? height : zero) + ')';
    }
    if (orientation === 'left') {
      return 'translate(' + zero + ', 0)';
    }
    if (orientation === 'right') {
      return 'translate(' + (zero === 0 ? width : zero) + ', 0)';
    }
    return '';
  },
  render: function render() {
    var _props2 = this.props;
    var height = _props2.height;
    var width = _props2.width;
    var tickArguments = _props2.tickArguments;
    var tickValues = _props2.tickValues;
    var tickFormat = _props2.tickFormat;
    var innerTickSize = _props2.innerTickSize;
    var tickPadding = _props2.tickPadding;
    var outerTickSize = _props2.outerTickSize;
    var scale = _props2.scale;
    var orientation = _props2.orientation;
    var className = _props2.className;
    var zero = _props2.zero;
    var label = _props2.label;
    var staggerLabels = _props2.staggerLabels;
    var gridLines = _props2.gridLines;

    var ticks = undefined;

    if (!tickValues) {
      ticks = scale.ticks ? scale.ticks.apply(scale, tickArguments) : scale.domain();
    } else {
      ticks = tickValues;
    }

    var tickFormatter = tickFormat;

    if (!tickFormatter) {
      if (scale.tickFormat) {
        tickFormatter = scale.tickFormat.apply(scale, tickArguments);
      } else {
        tickFormatter = function tickFormatter(x) {
          return x;
        };
      }
    }

    // TODO: is there a cleaner way? removes the 0 tick if axes are crossing
    if (zero != height && zero != width && zero != 0) {
      ticks = ticks.filter(function (element, index, array) {
        return element == 0 ? false : true;
      });
    }

    var tickSpacing = Math.max(innerTickSize, 0) + tickPadding;

    var sign = orientation === 'top' || orientation === 'left' ? -1 : 1;

    var range = this._d3_scaleRange(scale);

    var activeScale = scale.rangeBand ? function (e) {
      return scale(e) + scale.rangeBand() / 2;
    } : scale;

    var transform = undefined,
        x = undefined,
        y = undefined,
        x2 = undefined,
        y2 = undefined,
        dy = undefined,
        textAnchor = undefined,
        d = undefined,
        labelElement = undefined;
    if (orientation === 'bottom' || orientation === 'top') {
      transform = 'translate({}, 0)';
      x = 0;
      y = sign * tickSpacing;
      x2 = 0;
      y2 = sign * innerTickSize;
      dy = sign < 0 ? '0em' : '.71em';
      textAnchor = 'middle';
      d = 'M' + range[0] + ', ' + sign * outerTickSize + 'V0H' + range[1] + 'V' + sign * outerTickSize;

      labelElement = React.createElement(
        'text',
        { className: className + ' label', textAnchor: "end", x: width, y: -6 },
        label
      );
    } else {
      transform = 'translate(0, {})';
      x = sign * tickSpacing;
      y = 0;
      x2 = gridLines ? width : sign * innerTickSize;
      y2 = 0;
      dy = '.32em';
      textAnchor = sign < 0 ? 'end' : 'start';
      d = 'M' + sign * outerTickSize + ', ' + range[0] + 'H0V' + range[1] + 'H' + sign * outerTickSize;

      labelElement = React.createElement(
        'text',
        { className: className + ' label', textAnchor: "end", y: 6, dy: ".75em", transform: "rotate(-90)" },
        label
      );
    }

    var tickElements = ticks.map(function (tick, index) {
      var position = activeScale(tick);
      var translate = transform.replace('{}', position);
      var formatted = tickFormatter(tick);
      var tickClasses = ['tick'];
      var offset = 0;
      if (index % 2) {
        tickClasses.push('even');
        if (staggerLabels) {
          offset = 20;
        }
      } else {
        tickClasses.push('odd');
      }

      if (formatted.length < 1) {
        tickClasses.push('hidden');
      }
      return React.createElement(
        'g',
        { key: tick + '.' + index, className: tickClasses.join(' '), transform: translate },
        React.createElement('line', { x2: x2, y2: y2 + offset, stroke: '#aaa' }),
        React.createElement(
          'text',
          { x: x, y: y + offset, dy: dy, textAnchor: textAnchor },
          tickFormatter(tick)
        )
      );
    });

    var pathElement = React.createElement('path', { className: 'domain', d: d, fill: 'none', stroke: '#aaa' });

    var axisBackground = React.createElement('rect', { className: 'axis-background', fill: 'none' });

    return React.createElement(
      'g',
      { ref: 'axis', className: className, transform: this._getTranslateString(), style: { shapeRendering: 'crispEdges' } },
      axisBackground,
      tickElements,
      pathElement,
      labelElement
    );
  },
  _d3_scaleExtent: function _d3_scaleExtent(domain) {
    var start = domain[0];
    var stop = domain[domain.length - 1];
    return start < stop ? [start, stop] : [stop, start];
  },
  _d3_scaleRange: function _d3_scaleRange(scale) {
    return scale.rangeExtent ? scale.rangeExtent() : this._d3_scaleExtent(scale.range());
  }
});

module.exports = Axis;
'use strict';

var React = require('react');

var Bar = React.createClass({
  displayName: 'Bar',

  propTypes: {
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired,
    x: React.PropTypes.number.isRequired,
    y: React.PropTypes.number.isRequired,
    fill: React.PropTypes.string.isRequired,
    data: React.PropTypes.oneOfType([React.PropTypes.array, React.PropTypes.object]).isRequired,
    onMouseMove: React.PropTypes.func,
    onMouseLeave: React.PropTypes.func
  },

  render: function render() {
    var _props = this.props;
    var x = _props.x;
    var y = _props.y;
    var width = _props.width;
    var height = _props.height;
    var fill = _props.fill;
    var data = _props.data;
    var _onMouseMove = _props.onMouseMove;
    var _onMouseLeave = _props.onMouseLeave;

    return React.createElement('rect', {
      className: 'bar',
      x: x,
      y: y,
      width: width,
      height: height,
      fill: fill,
      onMouseMove: function onMouseMove(e) {
        _onMouseMove(e, data);
      },
      onMouseLeave: function onMouseLeave(e) {
        _onMouseLeave(e);
      }
    });
  }
});

module.exports = Bar;
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _helpers = require('./helpers.js');

var helpers = _interopRequireWildcard(_helpers);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var React = require('react');
var d3 = require('d3');
var Chart = require('./Chart');
var Axis = require('./Axis');
var Bar = require('./Bar');
var Tooltip = require('./Tooltip');

var DataSet = React.createClass({
  displayName: 'DataSet',

  propTypes: {
    data: React.PropTypes.array.isRequired,
    xScale: React.PropTypes.func.isRequired,
    yScale: React.PropTypes.func.isRequired,
    colorScale: React.PropTypes.func.isRequired,
    values: React.PropTypes.func.isRequired,
    label: React.PropTypes.func.isRequired,
    x: React.PropTypes.func.isRequired,
    y: React.PropTypes.func.isRequired,
    y0: React.PropTypes.func.isRequired,
    onMouseMove: React.PropTypes.func,
    onMouseLeave: React.PropTypes.func
  },

  render: function render() {
    var _props = this.props;
    var data = _props.data;
    var xScale = _props.xScale;
    var yScale = _props.yScale;
    var colorScale = _props.colorScale;
    var values = _props.values;
    var label = _props.label;
    var x = _props.x;
    var y = _props.y;
    var y0 = _props.y0;
    var onMouseMove = _props.onMouseMove;
    var onMouseLeave = _props.onMouseLeave;
    var groupedBars = _props.groupedBars;

    var bars = undefined;
    if (groupedBars) {
      bars = data.map(function (stack, serieIndex) {
        return values(stack).map(function (e, index) {
          return React.createElement(Bar, {
            key: label(stack) + '.' + index,
            width: xScale.rangeBand() / data.length,
            height: yScale(yScale.domain()[0]) - yScale(y(e)),
            x: xScale(x(e)) + xScale.rangeBand() * serieIndex / data.length,
            y: yScale(y(e)),
            fill: colorScale(label(stack)),
            data: e,
            onMouseMove: onMouseMove,
            onMouseLeave: onMouseLeave
          });
        });
      });
    } else {
      bars = data.map(function (stack) {
        return values(stack).map(function (e, index) {
          return React.createElement(Bar, {
            key: label(stack) + '.' + index,
            width: xScale.rangeBand(),
            height: yScale(yScale.domain()[0]) - yScale(y(e)),
            x: xScale(x(e)),
            y: yScale(y0(e) + y(e)),
            fill: colorScale(label(stack)),
            data: e,
            onMouseMove: onMouseMove,
            onMouseLeave: onMouseLeave
          });
        });
      });
    }

    return React.createElement(
      'g',
      null,
      bars
    );
  }
});

var BarChart = React.createClass({
  displayName: 'BarChart',

  propTypes: {
    barPadding: React.PropTypes.number,
    colorScale: React.PropTypes.func,
    data: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.array]).isRequired,
    height: React.PropTypes.number.isRequired,
    label: React.PropTypes.func,
    legend: React.PropTypes.object,
    margin: React.PropTypes.shape({
      top: React.PropTypes.number,
      bottom: React.PropTypes.number,
      left: React.PropTypes.number,
      right: React.PropTypes.number
    }),
    offset: React.PropTypes.string,
    tooltipHtml: React.PropTypes.func,
    tooltipMode: React.PropTypes.oneOf(['mouse', 'element', 'fixed']),
    tooltipContained: React.PropTypes.bool,
    tooltipOffset: React.PropTypes.objectOf(React.PropTypes.number),
    values: React.PropTypes.func,
    width: React.PropTypes.number.isRequired,
    x: React.PropTypes.func,
    xScale: React.PropTypes.func,
    y: React.PropTypes.func,
    y0: React.PropTypes.func,
    yScale: React.PropTypes.func
  },

  getDefaultProps: function getDefaultProps() {
    return {
      barPadding: 0.5,
      colorScale: d3.scale.category20(),
      data: { label: 'No data available', values: [{ x: 'No data available', y: 1 }] },
      label: function label(stack) {
        return stack.label;
      },
      margin: { top: 0, bottom: 0, left: 0, right: 0 },
      offset: 'zero',
      order: 'default',
      tooltipMode: 'mouse',
      tooltipOffset: { top: -35, left: 0 },
      tooltipHtml: null,
      tooltipContained: false,
      values: function values(stack) {
        return stack.values;
      },
      x: function x(e) {
        return e.x;
      },
      xScale: null,
      y: function y(e) {
        return e.y;
      },
      y0: function y0(e) {
        return e.y0;
      },
      yScale: null
    };
  },
  getInitialState: function getInitialState() {
    return {
      tooltip: {
        hidden: true
      }
    };
  },
  componentDidMount: function componentDidMount() {
    this._svg_node = React.findDOMNode(this).getElementsByTagName('svg')[0];
  },
  componentWillMount: function componentWillMount() {
    helpers.calculateInner(this, this.props);
    helpers.arrayify(this, this.props);
    this._stackData(this.props);
    helpers.makeScales(this, this.props);
  },
  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    helpers.calculateInner(this, nextProps);
    helpers.arrayify(this, nextProps);
    this._stackData(nextProps);
    helpers.makeScales(this, nextProps);
  },
  _stackData: function _stackData(props) {
    var offset = props.offset;
    var order = props.order;
    var x = props.x;
    var y = props.y;
    var values = props.values;

    var stack = d3.layout.stack().offset(offset).order(order).x(x).y(y).values(values);

    this._data = stack(this._data);
  },

  _tooltipHtml: function _tooltipHtml(d /*, position*/) {
    var xScale = this._xScale;
    var yScale = this._yScale;

    var x = this.props.x(d);
    var y0 = this.props.y0(d);

    var i = undefined,
        j = undefined;
    var midPoint = xScale.rangeBand() / 2;
    var xPos = midPoint + xScale(x);

    var topStack = this._data[this._data.length - 1].values;
    var topElement = null;

    for (i = 0; i < topStack.length; i++) {
      if (this.props.x(topStack[i]) === x) {
        topElement = topStack[i];
        break;
      }
    }
    var yPos = yScale(this.props.y0(topElement) + this.props.y(topElement));

    var datum = undefined,
        value = undefined,
        total = undefined,
        valuesLen = undefined,
        dataLabel = undefined;
    var dataLen = this._data.length;
    total = 0;
    for (i = 0; i < dataLen; ++i) {
      datum = this._data[i];
      valuesLen = datum.values.length;
      for (j = 0; j < valuesLen; ++j) {
        value = datum.values[j];
        if (value.x === x) {
          total += value.y;
          if (value.y0 === y0) {
            dataLabel = datum.label;
          }
        }
      } //end for
    } //end for

    var html = this.props.tooltipHtml(this.props.x(d), this.props.y0(d), this.props.y(d), total, dataLabel);

    return [html, xPos, yPos];
  },

  handleMouseMove: function handleMouseMove(e, data) {
    if (!this.props.tooltipHtml) {
      return;
    }

    e.preventDefault();

    var _props2 = this.props;
    var margin = _props2.margin;
    var tooltipMode = _props2.tooltipMode;
    var tooltipOffset = _props2.tooltipOffset;
    var tooltipContained = _props2.tooltipContained;

    var svg = this._svg_node;
    var position = undefined;
    if (svg.createSVGPoint) {
      var point = svg.createSVGPoint();
      point.x = e.clientX;
      point.y = e.clientY;
      point = point.matrixTransform(svg.getScreenCTM().inverse());
      position = [point.x - margin.left, point.y - margin.top];
    } else {
      var rect = svg.getBoundingClientRect();
      position = [e.clientX - rect.left - svg.clientLeft - margin.left, e.clientY - rect.top - svg.clientTop - margin.top];
    }

    var _tooltipHtml2 = this._tooltipHtml(data, position);

    var _tooltipHtml3 = _slicedToArray(_tooltipHtml2, 3);

    var html = _tooltipHtml3[0];
    var xPos = _tooltipHtml3[1];
    var yPos = _tooltipHtml3[2];

    var svgTop = svg.getBoundingClientRect().top + margin.top;
    var svgLeft = svg.getBoundingClientRect().left + margin.left;

    var top = 0;
    var left = 0;

    if (tooltipMode === 'fixed') {
      top = svgTop + tooltipOffset.top;
      left = svgLeft + tooltipOffset.left;
    } else if (tooltipMode === 'element') {
      top = svgTop + yPos + tooltipOffset.top;
      left = svgLeft + xPos + tooltipOffset.left;
    } else {
      // mouse
      top = e.clientY + tooltipOffset.top;
      left = e.clientX + tooltipOffset.left;
    }

    function lerp(t, a, b) {
      return (1 - t) * a + t * b;
    }

    var translate = 50;

    if (tooltipContained) {
      var t = position[0] / svg.getBoundingClientRect().width;
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
  },
  handleMouseLeave: function handleMouseLeave(e) {
    if (!this.props.tooltipHtml) {
      return;
    }

    e.preventDefault();

    this.setState({
      tooltip: {
        hidden: true
      }
    });
  },
  render: function render() {
    var _props3 = this.props;
    var height = _props3.height;
    var width = _props3.width;
    var margin = _props3.margin;
    var colorScale = _props3.colorScale;
    var values = _props3.values;
    var label = _props3.label;
    var y = _props3.y;
    var y0 = _props3.y0;
    var x = _props3.x;
    var xAxis = _props3.xAxis;
    var yAxis = _props3.yAxis;
    var groupedBars = _props3.groupedBars;
    var legend = _props3.legend;
    var data = this._data;
    var innerWidth = this._innerWidth;
    var innerHeight = this._innerHeight;
    var xScale = this._xScale;
    var yScale = this._yScale;

    return React.createElement(
      'div',
      null,
      React.createElement(
        Chart,
        { className: 'chart', height: height, width: width, margin: margin, legend: legend },
        React.createElement(Axis, _extends({ className: 'x axis', orientation: 'bottom', scale: xScale, height: innerHeight, width: innerWidth }, xAxis)),
        React.createElement(Axis, _extends({ className: 'y axis', orientation: 'left', scale: yScale, height: innerHeight, width: innerWidth }, yAxis)),
        React.createElement(DataSet, {
          data: data,
          xScale: xScale,
          yScale: yScale,
          colorScale: colorScale,
          values: values,
          label: label,
          y: y,
          y0: y0,
          x: x,
          onMouseMove: this.handleMouseMove,
          onMouseLeave: this.handleMouseLeave,
          groupedBars: groupedBars
        }),
        this.props.children
      ),
      React.createElement(Tooltip, this.state.tooltip)
    );
  }
});

module.exports = BarChart;
'use strict';

var React = require('react');
var d3 = require('d3');
var Legend = require('d3-svg-legend/no-extend');
var _ = require('lodash');
var scColor = require('sc-color');

var Chart = React.createClass({
  displayName: 'Chart',

  propTypes: {
    height: React.PropTypes.number.isRequired,
    width: React.PropTypes.number.isRequired,
    legend: React.PropTypes.object,
    margin: React.PropTypes.shape({
      top: React.PropTypes.number,
      bottom: React.PropTypes.number,
      left: React.PropTypes.number,
      right: React.PropTypes.number
    }).isRequired
  },

  componentDidMount: function componentDidMount() {
    this.renderLegend();
  },
  componentDidUpdate: function componentDidUpdate(prevProps) {
    if (!_.isEqual(this.props, prevProps)) {
      this.renderLegend();
    }
  },
  wrapText: function wrapText(text, width) {
    text.each(function () {
      var t = d3.select(this);
      //split words on space, slashes, underscores, or dashes
      var words = t.text().split(/[\s\/_-]+/).reverse();
      if (words.length > 0) {
        var line = [];
        var word = undefined;
        var lineNumber = 0;
        var lineHeight = 1.1; // ems
        var y = 0; // t.attr("y"),
        var dy = 0; //parseFloat(t.attr("dy")),
        var tspan = t.text(null).append('tspan').attr('x', 0).attr('y', y).attr('dy', dy + 'em');
        while (word = words.pop()) {
          line.push(word);
          tspan.text(line.join(' '));
          if (tspan.node().getComputedTextLength() > width) {
            line.pop();
            tspan.text(line.join(' '));
            line = [word];
            tspan = t.append('tspan').attr('x', 0).attr('y', y).attr('dy', lineNumber * lineHeight + dy + 'em').text(word);
            lineNumber += 1;
          }
        }
      }
    });
  },
  renderLegend: function renderLegend() {
    var _props = this.props;
    var width = _props.width;
    var height = _props.height;
    var margin = _props.margin;
    var legend = _props.legend;

    var domain = [];
    var range = [];
    var shapePadding = 10;
    var orient = 'horizontal';

    var colorArray = [];

    if (_.isPlainObject(legend)) {
      _.forIn(legend, function (val, key) {
        if (key === 'shapePadding') {
          shapePadding = val;
        } else if (key === 'orient') {
          orient = val;
        } else {
          var item = {};
          item.name = key;
          item.color = val;
          colorArray.push(item);
        }
      }, this);

      colorArray.sort(function (a, b) {
        return scColor(b.color).hue() - scColor(a.color).hue();
      });

      colorArray.forEach(function (x) {
        domain.push(x.name);
        range.push(x.color);
      });

      if (domain.length > 0 && range.length > 0) {
        var ordinal = d3.scale.ordinal().domain(domain).range(range);
        var svg = d3.select(this.refs.svg.getDOMNode());
        var leg = svg.select('.legend').call(Legend.color().shape('path', d3.svg.symbol().type('circle').size(80)()).shapePadding(shapePadding).orient(orient).scale(ordinal));
        if (_.isArray(leg) && leg.length > 0) {
          if (_.isArray(leg[0]) && leg[0].length > 0) {
            var bb = leg[0][0].getBBox();
            var xPos = width / 2 - bb.width / 2 + margin.left;
            var yPos = height;
            leg.attr('transform', 'translate(' + xPos + ', ' + yPos + ')');
          }
          leg.selectAll('.cell text').call(this.wrapText, ordinal.rangeBand());
        }
      }
    }
  },
  render: function render() {
    var _props2 = this.props;
    var width = _props2.width;
    var height = _props2.height;
    var margin = _props2.margin;
    var viewBox = _props2.viewBox;
    var preserveAspectRatio = _props2.preserveAspectRatio;
    var children = _props2.children;
    var legend = _props2.legend;

    var legendOffset = 0;
    if (_.isPlainObject(legend)) {
      legendOffset += 50;
    }
    return React.createElement(
      'div',
      null,
      React.createElement(
        'svg',
        { ref: 'svg', width: width, height: height + legendOffset, viewBox: viewBox, preserveAspectRatio: preserveAspectRatio },
        React.createElement(
          'g',
          { transform: 'translate(' + margin.left + ', ' + margin.top + ')' },
          children
        ),
        React.createElement('g', { className: 'legend' })
      )
    );
  }
});

module.exports = Chart;
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _helpers = require('./helpers.js');

var helpers = _interopRequireWildcard(_helpers);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var React = require('react');
var d3 = require('d3');
var Chart = require('./Chart');
var Axis = require('./Axis');
var Path = require('./Path');
var Tooltip = require('./Tooltip');

var DataSet = React.createClass({
  displayName: 'DataSet',

  propTypes: {
    data: React.PropTypes.array.isRequired,
    line: React.PropTypes.func.isRequired,
    colorScale: React.PropTypes.func.isRequired
  },

  render: function render() {
    var _props = this.props;
    var width = _props.width;
    var height = _props.height;
    var data = _props.data;
    var line = _props.line;
    var strokeWidth = _props.strokeWidth;
    var strokeLinecap = _props.strokeLinecap;
    var strokeDasharray = _props.strokeDasharray;
    var colorScale = _props.colorScale;
    var values = _props.values;
    var label = _props.label;
    var _onMouseMove = _props.onMouseMove;
    var _onMouseLeave = _props.onMouseLeave;

    var sizeId = width + 'x' + height;

    var lines = data.map(function (stack, index) {
      return React.createElement(Path, {
        key: label(stack) + '.' + index,
        className: 'line',
        d: line(values(stack)),
        stroke: colorScale(label(stack)),
        strokeWidth: typeof strokeWidth === 'function' ? strokeWidth(label(stack)) : strokeWidth,
        strokeLinecap: typeof strokeLinecap === 'function' ? strokeLinecap(label(stack)) : strokeLinecap,
        strokeDasharray: typeof strokeDasharray === 'function' ? strokeDasharray(label(stack)) : strokeDasharray,
        data: values(stack),
        onMouseMove: _onMouseMove,
        onMouseLeave: _onMouseLeave,
        style: { clipPath: 'url(#lineClip_' + sizeId + ')' }
      });
    });

    /*
       The <rect> below is needed in case we want to show the tooltip no matter where on the chart the mouse is.
       Not sure if this should be used.
       */
    var rect = React.renderToString(React.createElement('rect', { width: width, height: height }));
    return React.createElement(
      'g',
      null,
      React.createElement('g', { dangerouslySetInnerHTML: { __html: '<defs><clipPath id="lineClip_' + sizeId + '">' + rect } }),
      lines,
      React.createElement('rect', { width: width, height: height, fill: 'none', stroke: 'none', style: { pointerEvents: 'all' },
        onMouseMove: function onMouseMove(evt) {
          _onMouseMove(evt, data);
        },
        onMouseLeave: function onMouseLeave(evt) {
          _onMouseLeave(evt);
        }
      })
    );
  }
});

var LineChart = React.createClass({
  displayName: 'LineChart',

  propTypes: {
    barPadding: React.PropTypes.number,
    colorScale: React.PropTypes.func,
    data: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.array]).isRequired,
    defined: React.PropTypes.func,
    height: React.PropTypes.number.isRequired,
    interpolate: React.PropTypes.string,
    label: React.PropTypes.func,
    legend: React.PropTypes.object,
    margin: React.PropTypes.shape({
      top: React.PropTypes.number,
      bottom: React.PropTypes.number,
      left: React.PropTypes.number,
      right: React.PropTypes.number
    }),
    tooltipHtml: React.PropTypes.func,
    tooltipMode: React.PropTypes.oneOf(['mouse', 'element', 'fixed']),
    tooltipContained: React.PropTypes.bool,
    tooltipOffset: React.PropTypes.objectOf(React.PropTypes.number),
    values: React.PropTypes.func,
    width: React.PropTypes.number.isRequired,
    x: React.PropTypes.func,
    xScale: React.PropTypes.func,
    y: React.PropTypes.func,
    y0: React.PropTypes.func,
    yScale: React.PropTypes.func
  },

  getDefaultProps: function getDefaultProps() {
    return {
      barPadding: 0.5,
      colorScale: d3.scale.category20(),
      data: { label: 'No data available', values: [{ x: 'No data available', y: 1 }] },
      interpolate: 'linear',
      label: function label(stack) {
        return stack.label;
      },
      defined: function defined() {
        return true;
      },
      margin: { top: 0, bottom: 0, left: 0, right: 0 },
      shape: 'circle',
      shapeColor: null,
      tooltipMode: 'mouse',
      tooltipOffset: { top: -35, left: 0 },
      tooltipHtml: null,
      tooltipContained: false,
      values: function values(stack) {
        return stack.values;
      },
      x: function x(e) {
        return e.x;
      },
      xScale: null,
      y: function y(e) {
        return e.y;
      },
      y0: function y0() {
        return 0;
      },
      yScale: null
    };
  },
  getInitialState: function getInitialState() {
    return {
      tooltip: {
        hidden: true
      }
    };
  },
  componentDidMount: function componentDidMount() {
    this._svg_node = React.findDOMNode(this).getElementsByTagName('svg')[0];
  },
  componentWillMount: function componentWillMount() {
    helpers.calculateInner(this, this.props);
    helpers.arrayify(this, this.props);
    helpers.makeScales(this, this.props);
  },
  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    helpers.calculateInner(this, nextProps);
    helpers.arrayify(this, nextProps);
    helpers.makeScales(this, nextProps);
  },
  handleMouseMove: function handleMouseMove(e, data) {
    if (!this.props.tooltipHtml) {
      return;
    }

    e.preventDefault();

    var _props2 = this.props;
    var margin = _props2.margin;
    var tooltipMode = _props2.tooltipMode;
    var tooltipOffset = _props2.tooltipOffset;
    var tooltipContained = _props2.tooltipContained;

    var svg = this._svg_node;
    var position = undefined;
    if (svg.createSVGPoint) {
      var point = svg.createSVGPoint();
      point.x = e.clientX;
      point.y = e.clientY;
      point = point.matrixTransform(svg.getScreenCTM().inverse());
      position = [point.x - margin.left, point.y - margin.top];
    } else {
      var rect = svg.getBoundingClientRect();
      position = [e.clientX - rect.left - svg.clientLeft - margin.left, e.clientY - rect.top - svg.clientTop - margin.top];
    }

    var _tooltipHtml = this._tooltipHtml(data, position);

    var _tooltipHtml2 = _slicedToArray(_tooltipHtml, 3);

    var html = _tooltipHtml2[0];
    var xPos = _tooltipHtml2[1];
    var yPos = _tooltipHtml2[2];

    var svgTop = svg.getBoundingClientRect().top + margin.top;
    var svgLeft = svg.getBoundingClientRect().left + margin.left;

    var top = 0;
    var left = 0;

    if (tooltipMode === 'fixed') {
      top = svgTop + tooltipOffset.top;
      left = svgLeft + tooltipOffset.left;
    } else if (tooltipMode === 'element') {
      top = svgTop + yPos + tooltipOffset.top;
      left = svgLeft + xPos + tooltipOffset.left;
    } else {
      // mouse
      top = e.clientY + tooltipOffset.top;
      left = e.clientX + tooltipOffset.left;
    }

    function lerp(t, a, b) {
      return (1 - t) * a + t * b;
    }

    var translate = 50;

    if (tooltipContained) {
      var t = position[0] / svg.getBoundingClientRect().width;
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
  },
  handleMouseLeave: function handleMouseLeave(e) {
    if (!this.props.tooltipHtml) {
      return;
    }

    e.preventDefault();

    this.setState({
      tooltip: {
        hidden: true
      }
    });
  },

  /*
     The code below supports finding the data values for the line closest to the mouse cursor.
     Since it gets all events from the Rect overlaying the Chart the tooltip gets shown everywhere.
     For now I don't want to use this method.
     */
  _tooltipHtml: function _tooltipHtml(data, position) {
    var _props3 = this.props;
    var x = _props3.x;
    var y0 = _props3.y0;
    var y = _props3.y;
    var values = _props3.values;
    var label = _props3.label;
    var xScale = this._xScale;
    var yScale = this._yScale;

    var xValueCursor = xScale.invert(position[0]);
    var yValueCursor = yScale.invert(position[1]);

    var xBisector = d3.bisector(function (e) {
      return x(e);
    }).left;
    var valuesAtX = data.map(function (stack) {
      var idx = xBisector(values(stack), xValueCursor);

      var indexRight = idx === values(stack).length ? idx - 1 : idx;
      var valueRight = x(values(stack)[indexRight]);

      var indexLeft = idx === 0 ? idx : idx - 1;
      var valueLeft = x(values(stack)[indexLeft]);

      var index = undefined;
      if (Math.abs(xValueCursor - valueRight) < Math.abs(xValueCursor - valueLeft)) {
        index = indexRight;
      } else {
        index = indexLeft;
      }

      return { label: label(stack), value: values(stack)[index] };
    });

    valuesAtX.sort(function (a, b) {
      return y(a.value) - y(b.value);
    });

    var yBisector = d3.bisector(function (e) {
      return y(e.value);
    }).left;
    var yIndex = yBisector(valuesAtX, yValueCursor);

    var yIndexRight = yIndex === valuesAtX.length ? yIndex - 1 : yIndex;
    var yIndexLeft = yIndex === 0 ? yIndex : yIndex - 1;

    var yValueRight = y(valuesAtX[yIndexRight].value);
    var yValueLeft = y(valuesAtX[yIndexLeft].value);

    var index = undefined;
    if (Math.abs(yValueCursor - yValueRight) < Math.abs(yValueCursor - yValueLeft)) {
      index = yIndexRight;
    } else {
      index = yIndexLeft;
    }

    this._tooltipData = valuesAtX[index];

    var html = this.props.tooltipHtml(valuesAtX[index].label, valuesAtX[index].value);

    var xPos = xScale(valuesAtX[index].value.x);
    var yPos = yScale(valuesAtX[index].value.y);
    return [html, xPos, yPos];
  },
  render: function render() {
    var _this = this;

    var _props4 = this.props;
    var height = _props4.height;
    var width = _props4.width;
    var margin = _props4.margin;
    var colorScale = _props4.colorScale;
    var interpolate = _props4.interpolate;
    var defined = _props4.defined;
    var stroke = _props4.stroke;
    var values = _props4.values;
    var label = _props4.label;
    var x = _props4.x;
    var y = _props4.y;
    var xAxis = _props4.xAxis;
    var yAxis = _props4.yAxis;
    var shape = _props4.shape;
    var shapeColor = _props4.shapeColor;
    var legend = _props4.legend;
    var data = this._data;
    var innerWidth = this._innerWidth;
    var innerHeight = this._innerHeight;
    var xScale = this._xScale;
    var yScale = this._yScale;
    var xIntercept = this._xIntercept;
    var yIntercept = this._yIntercept;

    var line = d3.svg.line().x(function (e) {
      return xScale(x(e));
    }).y(function (e) {
      return yScale(y(e));
    }).interpolate(interpolate).defined(defined);

    var tooltipSymbol = undefined;
    if (!this.state.tooltip.hidden) {
      var symbol = d3.svg.symbol().type(shape);
      var symbolColor = shapeColor ? shapeColor : colorScale(this._tooltipData.label);

      var translate = this._tooltipData ? 'translate(' + xScale(x(this._tooltipData.value)) + ', ' + yScale(y(this._tooltipData.value)) + ')' : '';
      tooltipSymbol = this.state.tooltip.hidden ? null : React.createElement('path', { className: 'dot', d: symbol(), transform: translate, fill: symbolColor, onMouseMove: function onMouseMove(evt) {
          _this.handleMouseMove(evt, data);
        }, onMouseLeave: function onMouseLeave(evt) {
          _this.handleMouseLeave(evt);
        } });
    }

    return React.createElement(
      'div',
      null,
      React.createElement(
        Chart,
        { className: 'chart', height: height, width: width, margin: margin, legend: legend },
        React.createElement(Axis, _extends({ className: 'x axis', orientation: 'bottom', scale: xScale, height: innerHeight, width: innerWidth, zero: yIntercept }, xAxis)),
        React.createElement(Axis, _extends({ className: 'y axis', orientation: 'left', scale: yScale, height: innerHeight, width: innerWidth, zero: xIntercept }, yAxis)),
        React.createElement(DataSet, _extends({ height: innerHeight, width: innerWidth, data: data, line: line, colorScale: colorScale, values: values, label: label, onMouseMove: this.handleMouseMove, onMouseLeave: this.handleMouseLeave }, stroke)),
        this.props.children,
        tooltipSymbol
      ),
      React.createElement(Tooltip, this.state.tooltip)
    );
  }
});

module.exports = LineChart;
'use strict';

var React = require('react');

var Path = React.createClass({
  displayName: 'Path',

  propTypes: {
    className: React.PropTypes.string,
    stroke: React.PropTypes.string.isRequired,
    strokeLinecap: React.PropTypes.string,
    strokeWidth: React.PropTypes.string,
    strokeDasharray: React.PropTypes.string,
    fill: React.PropTypes.string,
    d: React.PropTypes.string.isRequired,
    data: React.PropTypes.array.isRequired,
    onMouseMove: React.PropTypes.func,
    onMouseLeave: React.PropTypes.func
  },

  getDefaultProps: function getDefaultProps() {
    return {
      className: 'path',
      fill: 'none',
      strokeWidth: '2',
      strokeLinecap: 'butt',
      strokeDasharray: 'none'
    };
  },
  render: function render() {
    var _props = this.props;
    var className = _props.className;
    var stroke = _props.stroke;
    var strokeWidth = _props.strokeWidth;
    var strokeLinecap = _props.strokeLinecap;
    var strokeDasharray = _props.strokeDasharray;
    var fill = _props.fill;
    var d = _props.d;
    var style = _props.style;
    var data = _props.data;
    var _onMouseMove = _props.onMouseMove;
    var _onMouseLeave = _props.onMouseLeave;

    return React.createElement('path', {
      className: className,
      stroke: stroke,
      strokeWidth: strokeWidth,
      strokeLinecap: strokeLinecap,
      strokeDasharray: strokeDasharray,
      fill: fill,
      d: d,
      onMouseMove: function onMouseMove(evt) {
        _onMouseMove(evt, data);
      },
      onMouseLeave: function onMouseLeave(evt) {
        _onMouseLeave(evt);
      },
      style: style
    });
  }
});

module.exports = Path;
'use strict';

var React = require('react');

var Tooltip = React.createClass({
  displayName: 'Tooltip',

  propTypes: {
    top: React.PropTypes.number.isRequired,
    left: React.PropTypes.number.isRequired,
    html: React.PropTypes.node,
    hidden: React.PropTypes.bool,
    translate: React.PropTypes.number
  },

  getDefaultProps: function getDefaultProps() {
    return {
      top: 150,
      left: 100,
      html: '',
      translate: 50
    };
  },
  render: function render() {
    var _props = this.props;
    var top = _props.top;
    var left = _props.left;
    var hidden = _props.hidden;
    var html = _props.html;
    var translate = _props.translate;

    var style = {
      display: hidden ? 'none' : 'block',
      position: 'fixed',
      top: top,
      left: left,
      transform: 'translate(-' + translate + '%, 0)',
      pointerEvents: 'none'
    };

    return React.createElement(
      'div',
      { className: 'tooltip', style: style },
      html
    );
  }
});

module.exports = Tooltip;
'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calculateInner = calculateInner;
exports.arrayify = arrayify;
exports.makeLinearXScale = makeLinearXScale;
exports.makeOrdinalXScale = makeOrdinalXScale;
exports.makeTimeXScale = makeTimeXScale;
exports.makeLinearYScale = makeLinearYScale;
exports.makeOrdinalYScale = makeOrdinalYScale;
exports.makeXScale = makeXScale;
exports.makeYScale = makeYScale;
exports.makeScales = makeScales;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _d2 = require('d3');

var _d3 = _interopRequireDefault(_d2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function calculateInner(component, props) {
  var height = props.height;
  var width = props.width;
  var margin = props.margin;

  component._innerHeight = height - margin.top - margin.bottom;
  component._innerWidth = width - margin.left - margin.right;
}

function arrayify(component, props) {
  if (props.data === null) {
    component._data = [{
      label: 'No data available',
      values: [{ x: 'No data available', y: 1 }]
    }];
  } else if (!Array.isArray(props.data)) {
    component._data = [props.data];
  } else {
    component._data = props.data;
  }
}

function makeLinearXScale(component, props) {
  var x = props.x;
  var values = props.values;
  var data = component._data;
  var innerWidth = component._innerWidth;

  var extents = _d3.default.extent(Array.prototype.concat.apply([], data.map(function (stack) {
    return values(stack).map(function (e) {
      return x(e);
    });
  })));

  var scale = _d3.default.scale.linear().domain(extents).range([0, innerWidth]);

  var zero = _d3.default.max([0, scale.domain()[0]]);
  var xIntercept = scale(zero);

  return [scale, xIntercept];
}

function makeOrdinalXScale(component, props) {
  var x = props.x;
  var values = props.values;
  var barPadding = props.barPadding;
  var data = component._data;
  var innerWidth = component._innerWidth;

  var scale = undefined;

  if (_lodash2.default.isFunction(values) && _lodash2.default.isArray(data) && data.length > 0) {
    scale = _d3.default.scale.ordinal().domain(values(data[0]).map(function (e) {
      return x(e);
    })).rangeRoundBands([0, innerWidth], barPadding);
  } else {
    scale = _d3.default.scale.ordinal();
  }
  return [scale, 0];
}

function makeTimeXScale(component, props) {
  var x = props.x;
  var values = props.values;
  var data = component._data;
  var innerWidth = component._innerWidth;

  var minDate = _d3.default.min(values(data[0]), x);

  var maxDate = _d3.default.max(values(data[0]), x);

  var scale = _d3.default.time.scale().domain([minDate, maxDate]).range([0, innerWidth]);

  return [scale, 0];
}

function makeLinearYScale(component, props) {
  var y = props.y;
  var y0 = props.y0;
  var values = props.values;
  var groupedBars = props.groupedBars;
  var data = component._data;
  var innerHeight = component._innerHeight;

  var extents = _d3.default.extent(Array.prototype.concat.apply([], data.map(function (stack) {
    return values(stack).map(function (e) {
      if (groupedBars) {
        return y(e);
      }
      return y0(e) + y(e);
    });
  })));

  extents = [_d3.default.min([0, extents[0]]), extents[1]];

  var scale = _d3.default.scale.linear().domain(extents).range([innerHeight, 0]);

  var zero = _d3.default.max([0, scale.domain()[0]]);
  var yIntercept = scale(zero);

  return [scale, yIntercept];
}

function makeOrdinalYScale(component) {
  var _ref = [component._data, component._innerHeight];
  var innerHeight = _ref[0];

  var scale = _d3.default.scale.ordinal().range([innerHeight, 0]);
  var yIntercept = scale(0);

  return [scale, yIntercept];
}

function makeXScale(component, props) {
  var x = props.x;
  var values = props.values;

  var data = component._data;

  if (_lodash2.default.isFunction(x) && _lodash2.default.isFunction(values) && _lodash2.default.isArray(data) && data.length > 0) {
    if (typeof x(values(data[0])[0]) === 'number') {
      return makeLinearXScale(component, props);
    }

    if (typeof x(values(data[0])[0]).getMonth === 'function') {
      return makeTimeXScale(component, props);
    }
  }
  return makeOrdinalXScale(component, props);
}

function makeYScale(component, props) {
  var y = props.y;
  var values = props.values;

  var data = component._data;

  if (_lodash2.default.isFunction(y) && _lodash2.default.isFunction(values) && _lodash2.default.isArray(data) && data.length > 0) {
    if (typeof y(values(data[0])[0]) === 'number') {
      return makeLinearYScale(component, props);
    }
  }
  return makeOrdinalYScale(component, props);
}

function makeScales(component, props) {
  var xScale = props.xScale;
  var xIntercept = props.xIntercept;
  var yScale = props.yScale;
  var yIntercept = props.yIntercept;

  if (!xScale) {
    var _makeXScale = makeXScale(component, props);

    var _makeXScale2 = _slicedToArray(_makeXScale, 2);

    component._xScale = _makeXScale2[0];
    component._xIntercept = _makeXScale2[1];
  } else {
    var _ref2 = [xScale, xIntercept];
    component._xScale = _ref2[0];
    component._xIntercept = _ref2[1];
  }

  if (!yScale) {
    var _makeYScale = makeYScale(component, props);

    var _makeYScale2 = _slicedToArray(_makeYScale, 2);

    component._yScale = _makeYScale2[0];
    component._yIntercept = _makeYScale2[1];
  } else {
    var _ref3 = [yScale, yIntercept];
    component._yScale = _ref3[0];
    component._yIntercept = _ref3[1];
  }
}

//# sourceMappingURL=react-d3-charts.js.map