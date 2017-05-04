import _ from 'lodash';
import d3 from 'd3/d3.min.js';

export function calculateInner(component, props) {
  const { height, width, margin } = props;
  component._innerHeight = height - margin.top - margin.bottom;
  component._innerWidth = width - margin.left - margin.right;
}

export function arrayify(component, props) {
  const isEmptyObject = _.isPlainObject(props.data) && _.keys(props.data).length < 1;
  const isEmptyArray = _.isArray(props.data) && props.data.length < 1;
  if (props.data === null || isEmptyObject || isEmptyArray) {
    component._data = [{
      label: 'No data available',
      values: [{x: 'No data available', y: 1}]
    }];
  } else if (!Array.isArray(props.data)) {
    component._data = [props.data];
  } else {
    component._data = props.data;
  }
}

export function makeLinearXScale(component, props) {
  const {x, values} = props;
  const [ data, innerWidth ] = [component._data, component._innerWidth];

  const extents =
    d3.extent(
        Array.prototype.concat.apply([],
          data.map(stack => {
            return values(stack).map(e => {
              return x(e);
            });
          })));

  const scale = d3.scale.linear()
    .domain(extents)
    .range([0, innerWidth]);

  const zero = d3.max([0, scale.domain()[0]]);
  const xIntercept = scale(zero);

  return [scale, xIntercept];
}

export function makeOrdinalXScale(component, props) {
  const { x, values } = props;
  const barPadding = _.isNumber(props.barPadding) ? props.barPadding : 0.5;
  const [ data, innerWidth ] = [component._data, component._innerWidth];
  let scale;

  if (_.isFunction(values) && _.isArray(data) && data.length > 0){
    scale = d3.scale.ordinal().domain(values(data[0]).map(e => { return x(e); })).rangeRoundBands([0, innerWidth], barPadding);
  } else {
    scale = d3.scale.ordinal();
  }
  return [scale, 0];
}

export function makeTimeXScale(component, props) {
  const { x, values } = props;
  const [ data, innerWidth ] = [component._data, component._innerWidth];

  const minDate = d3.min(values(data[0]), x);

  const maxDate = d3.max(values(data[0]), x);

  const scale = d3.time.scale()
    .domain([minDate, maxDate])
    .range([0, innerWidth]);

  return [scale, 0];
}

export function makeLinearYScale(component, props) {
  const { y, y0, values, groupedBars } = props;
  const [ data, innerHeight ] = [component._data, component._innerHeight];

  let extents =
    d3.extent(
        Array.prototype.concat.apply([],
          data.map(stack => {
            return values(stack).map(e => {
              if (groupedBars) {
                return y(e);
              }
              return y0(e) + y(e);
            });
          })));

  extents = [d3.min([0, extents[0]]), extents[1]];

  const scale = d3.scale.linear().domain(extents).range([innerHeight, 0]);

  const zero = d3.max([0, scale.domain()[0]]);
  const yIntercept = scale(zero);

  return [scale, yIntercept];
}

export function makeOrdinalYScale(component) {
  const [ innerHeight ] = [component._data, component._innerHeight];
  const scale = d3.scale.ordinal().range([innerHeight, 0]);
  const yIntercept = scale(0);

  return [scale, yIntercept];
}

export function makeXScale(component, props) {
  const { x, values } = props;
  const data = component._data;

  if (_.isFunction(x) && _.isFunction(values) && _.isArray(data) && data.length > 0){
    if (typeof (x(values(data[0])[0])) === 'number') {
      return makeLinearXScale(component, props);
    }

    if (typeof x(values(data[0])[0]).getMonth === 'function') {
      return makeTimeXScale(component, props);
    }
  }
  return makeOrdinalXScale(component, props);
}

export function makeYScale(component, props) {
  const { y, values } = props;
  const data = component._data;

  if (_.isFunction(y) && _.isFunction(values) && _.isArray(data) && data.length > 0){
    if (typeof y(values(data[0])[0]) === 'number') {
      return makeLinearYScale(component, props);
    }
  }
  return makeOrdinalYScale(component, props);
}

export function makeScales(component, props) {
  const { xScale, xIntercept, yScale, yIntercept } = props;

  if (!xScale) {
    [component._xScale, component._xIntercept] = makeXScale(component, props);
  } else {
    [component._xScale, component._xIntercept] = [xScale, xIntercept];
  }

  if (!yScale) {
    [component._yScale, component._yIntercept] = makeYScale(component, props);
  } else {
    [component._yScale, component._yIntercept] = [yScale, yIntercept];
  }
}

export function addTooltipMouseHandlers(component) {
  component.handleMouseLeave = function(e) {
    if (!this.props.tooltipHtml) {
      return;
    }

    e.preventDefault();

    this.setState({
      tooltip: {
        hidden: true
      }
    });
  };
  component.handleMouseMove = function(e, data) {
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
      position = [e.clientX - rect.left - svg.clientLeft - margin.left, e.clientY - rect.top - svg.clientTop - margin.top];
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
  };
}

