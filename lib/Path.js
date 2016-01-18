const React = require('react');

const Path = React.createClass({
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

  getDefaultProps() {
    return {
      className: 'path',
      fill: 'none',
      strokeWidth: '2',
      strokeLinecap: 'butt',
      strokeDasharray: 'none'
    };
  },

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
        <path
        className={className}
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
});

module.exports = Path;
