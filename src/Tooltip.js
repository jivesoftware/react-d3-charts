import React, { PropTypes, Component } from 'react';

class Tooltip extends Component {

  static propTypes = {
    top: PropTypes.number.isRequired,
    left: PropTypes.number.isRequired,
    html: PropTypes.node,
    hidden: PropTypes.bool,
    translate: PropTypes.number,
    className: PropTypes.string
  };

  static defaultProps = {
    top: 150,
    left: 100,
    html: '',
    translate: 50,
    className: 'tooltip'
  };

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

    return ( <div className={this.props.className} style={style}>{html}</div> );
  }

}

export default Tooltip;
