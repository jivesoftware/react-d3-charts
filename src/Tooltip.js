const React = require('react');

const Tooltip = React.createClass({
  propTypes: {
    top: React.PropTypes.number.isRequired,
    left: React.PropTypes.number.isRequired,
    html: React.PropTypes.node,
    hidden: React.PropTypes.bool,
    translate: React.PropTypes.number
  },

  getDefaultProps() {
    return {
      top: 150,
      left: 100,
      html: '',
      translate: 50
    };
  },

  render() {
    const {top, left, hidden, html, translate} = this.props;

    const style = {
      display: hidden ? 'none' : 'block',
      position: 'fixed',
      top: top,
      left: left,
      transform: `translate(-${translate}%, 0)`,
      pointerEvents: 'none'
    };

    return ( <div className='tooltip' style={style}>{html}</div> );
  }
});

module.exports = Tooltip;
