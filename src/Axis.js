import React, { PropTypes, Component } from 'react';
import _ from 'lodash';

class Axis extends Component {

  static propTypes = {
    height: PropTypes.number,
    width: PropTypes.number,
    tickArguments: PropTypes.array,
    tickValues: PropTypes.array,
    tickFormat: PropTypes.func, //format tick label text
    tickFilter: PropTypes.func, //filter ticks before elements are created
    innerTickSize: PropTypes.number,
    tickPadding: PropTypes.number,
    outerTickSize: PropTypes.number,
    scale: PropTypes.func.isRequired,
    className: PropTypes.string,
    zero: PropTypes.number,
    orientation: PropTypes.oneOf(['top', 'bottom', 'left', 'right']).isRequired,
    label: PropTypes.string,
    staggerLabels: PropTypes.bool,
    gridLines: PropTypes.bool,
    visible: PropTypes.bool,
  };

  static defaultProps = {
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
    gridLines: false,
    visible: true
  };

  _getTranslateString() {
    const {
      orientation,
      height,
      width,
      zero
    } = this.props;

    if (orientation === 'top') {
      return `translate(0, ${zero})`;
    }
    if (orientation === 'bottom') {
      return `translate(0, ${zero === 0 ? height : zero})`;
    }
    if (orientation === 'left') {
      return `translate(${zero}, 0)`;
    }
    if (orientation === 'right') {
      return `translate(${zero === 0 ? width : zero}, 0)`;
    }
    return '';
  }

  render() {
    const {
      height,
      width,
      tickArguments,
      tickValues,
      tickFormat,
      innerTickSize,
      tickPadding,
      outerTickSize,
      scale,
      orientation,
      className,
      zero,
      label,
      staggerLabels,
      gridLines,
      visible
    } = this.props;

    if (!visible) {
      return <g />;
    }

    let ticks;

    if (!tickValues){
      ticks = scale.ticks ? scale.ticks.apply(scale, tickArguments) : scale.domain();
    } else {
      ticks = tickValues;
    }

    let tickFormatter = tickFormat;

    if (!tickFormatter) {
      if (scale.tickFormat) {
        tickFormatter = scale.tickFormat.apply(scale, tickArguments);
      } else {
        tickFormatter = x => { return x; };
      }
    }

    // TODO: is there a cleaner way? removes the 0 tick if axes are crossing
    if (zero !== height && zero !== width && zero !== 0) {
      ticks = ticks.filter((element) => { return element === 0 ? false : true;});
    }

    const tickSpacing = Math.max(innerTickSize, 0) + tickPadding;

    const sign = orientation === 'top' || orientation === 'left' ? -1 : 1;

    const range = this._d3ScaleRange(scale);

    const activeScale = scale.rangeBand ? e => { return scale(e) + scale.rangeBand() / 2; } : scale;

    let transform, x, y, x2, y2, dy, textAnchor, d, labelElement;
    if (orientation === 'bottom' || orientation === 'top') {
      transform = 'translate({}, 0)';
      x = 0;
      y = sign * tickSpacing;
      x2 = 0;
      y2 = gridLines ? (-1 * height) : (sign * innerTickSize);
      dy = sign < 0 ? '0em' : '.71em';
      textAnchor = 'middle';
      d = `M${range[0]}, ${sign * outerTickSize}V0H${range[1]}V${sign * outerTickSize}`;

      labelElement = <text className={`${className} label`} textAnchor={'end'} x={width} y={-6}>{label}</text>;
    } else {
      transform = 'translate(0, {})';
      x = sign * tickSpacing;
      y = 0;
      x2 = gridLines ? width : (sign * innerTickSize);
      y2 = 0;
      dy = '.32em';
      textAnchor = sign < 0 ? 'end' : 'start';
      d = `M${sign * outerTickSize}, ${range[0]}H0V${range[1]}H${sign * outerTickSize}`;

      labelElement = <text className={`${className} label`} textAnchor={'end'} y={6} dy={'.75em'} transform={'rotate(-90)'}>{label}</text>;
    }

    const tickElements = _.compact(ticks.map((tick, index) => {
      const position = activeScale(tick);
      const translate = transform.replace('{}', position);
      const formatted = tickFormatter(tick);
      const tickClasses = ['tick'];
      let offset = 0;
      if (index % 2){
        tickClasses.push('even');
        if (staggerLabels){
          offset = 20;
        }
      } else {
        tickClasses.push('odd');
      }

      if (formatted.length < 1){
        tickClasses.push('hidden');
      }
      if (_.isFunction(this.props.tickFilter)){
        if (!this.props.tickFilter.call(scale, tick, formatted, index)){
          return null;
        }
      }
      return (
        <g key={`${tick}.${index}`} className={ tickClasses.join(' ') } transform={translate}>
          <line x2={x2} y2={y2 + offset} stroke='#aaa'/>
          <text x={x} y={y + offset} dy={dy} textAnchor={textAnchor}>
          {tickFormatter(tick)}</text>
        </g>
      );
    }));

    const pathElement = <path className='domain' d={d} fill='none' stroke='#aaa'/>;

    const axisBackground = <rect className='axis-background' fill='none'/>;

    return (
      <g ref='axis' className={className} transform={this._getTranslateString()} style={{shapeRendering: 'crispEdges'}}>
        {axisBackground}
        {tickElements}
        {pathElement}
        {labelElement}
      </g>
    );
  }

  _d3ScaleExtent(domain) {
    const start = domain[0];
    const stop = domain[domain.length - 1];
    return start < stop ? [start, stop] : [stop, start];
  }

  _d3ScaleRange(scale) {
    return scale.rangeExtent ? scale.rangeExtent() : this._d3ScaleExtent(scale.range());
  }
}

export default Axis;
