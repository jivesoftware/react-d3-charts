import React, { PropTypes, Component } from 'react';

class Path extends Component {

  static propTypes = {
    className: PropTypes.string,
    stroke: PropTypes.string.isRequired,
    strokeLinecap: PropTypes.string,
    strokeWidth: PropTypes.string,
    strokeDasharray: PropTypes.string,
    fill: PropTypes.string,
    d: PropTypes.string.isRequired,
    data: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
    onMouseMove: PropTypes.func,
    onMouseLeave: PropTypes.func,
    style: PropTypes.object
  };

  static defaultProps = {
    className: 'path',
    fill: 'none',
    strokeWidth: '2',
    strokeLinecap: 'butt',
    strokeDasharray: 'none'
  };

  render() {
    const  {
      className,
      stroke,
      strokeWidth,
      strokeLinecap,
      strokeDasharray,
      fill,
      d,
      style,
      data,
      onMouseMove,
      onMouseLeave
    } = this.props;

    return (
      <path className={className}
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinecap={strokeLinecap}
            strokeDasharray={strokeDasharray}
            fill={fill}
            d={d}
            onMouseMove={ evt => { onMouseMove(evt, data); } }
            onMouseLeave={  evt => { onMouseLeave(evt); } }
            style={style}
      />
    );
  }
}

export default Path;
