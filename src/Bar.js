import React, { PropTypes, Component } from 'react';

class Bar extends Component {

  static propTypes = {
    className: PropTypes.string,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    fill: PropTypes.string.isRequired,
    data: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.object
    ]).isRequired,
    onMouseMove: PropTypes.func,
    onMouseLeave: PropTypes.func
  };

  static defaultProps = {
    className: 'bar'
  };

  render() {
    const {
      className,
      x,
      y,
      width,
      height,
      fill,
      data,
      onMouseMove,
      onMouseLeave
    } = this.props;

    return (
      <rect
        className={className}
        x={x}
        y={y}
        width={width}
        height={height}
        fill={fill}
        onMouseMove={ e => { onMouseMove(e, data); } }
        onMouseLeave={ e => { onMouseLeave(e); } }
      />
    );
  }
}

export default Bar;
