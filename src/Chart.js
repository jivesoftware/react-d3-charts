const React = require('react');
const d3 = require('d3');
const Legend = require('d3-svg-legend/no-extend');
const _ = require('lodash');
const scColor = require('sc-color');

const Chart = React.createClass({
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

  componentDidMount() {
    this.renderLegend();
  },

  componentDidUpdate(prevProps) {
    if (!_.isEqual(this.props, prevProps)){
      this.renderLegend();
    }
  },

  wrapText(text, width) {
    text.each(function() {
      const t = d3.select(this);
      //split words on space, slashes, underscores, or dashes
      const words = t.text().split(/[\s\/_-]+/).reverse();
      if (words.length > 0){
        let line = [];
        let word;
        let lineNumber = 0;
        const lineHeight = 1.1; // ems
        const y = 0;// t.attr("y"),
        const dy = 0;//parseFloat(t.attr("dy")),
        let tspan = t.text(null).append('tspan').attr('x', 0).attr('y', y).attr('dy', dy + 'em');
        while (word = words.pop()) {
          line.push(word);
          tspan.text(line.join(' '));
          if (tspan.node().getComputedTextLength() > width) {
            line.pop();
            tspan.text(line.join(' '));
            line = [word];
            tspan = t.append('tspan').attr('x', 0).attr('y', y).attr('dy', (lineNumber * lineHeight) + dy + 'em').text(word);
            lineNumber += 1;
          }
        }
      }
    });
  },

  renderLegend() {
    const { width, height, margin, legend} = this.props;
    const domain = [];
    const range = [];
    let shapePadding = 10;
    let orient = 'horizontal';

    const colorArray = [];

    if (_.isPlainObject(legend)){
      _.forIn(legend, function(val, key){
        if (key === 'shapePadding'){
          shapePadding = val;
        } else if (key === 'orient'){
          orient = val;
        } else {
          const item = {};
          item.name = key;
          item.color = val;
          colorArray.push(item);
        }
      }, this);

      colorArray.sort(function(a, b) {
        return scColor(b.color).hue() - scColor(a.color).hue();
      });

      colorArray.forEach(function(x){
        domain.push(x.name);
        range.push(x.color);
      });


      if (domain.length > 0 && range.length > 0){
        const ordinal = d3.scale.ordinal().domain(domain).range(range);
        const svg = d3.select(this.refs.svg.getDOMNode());
        const leg = svg.select('.legend').call(Legend.color().shape('path', d3.svg.symbol().type('circle').size(80)()).shapePadding(shapePadding).orient(orient).scale(ordinal));
        if (_.isArray(leg) && leg.length > 0){
          if (_.isArray(leg[0]) && leg[0].length > 0){
            const bb = leg[0][0].getBBox();
            const xPos = (width/ 2) - (bb.width / 2) + margin.left;
            const yPos = height;
            leg.attr('transform', `translate(${xPos}, ${yPos})`);
          }
          leg.selectAll('.cell text').call(this.wrapText, ordinal.rangeBand());
        }
      }
    }
  },

  render() {
    const { width, height, margin, viewBox, preserveAspectRatio, children, legend} = this.props;
    let legendOffset = 0;
    if (_.isPlainObject(legend)){
      legendOffset += 50;
    }
    return (
      <div>
        <svg ref='svg' width={width} height={height+legendOffset} viewBox={viewBox} preserveAspectRatio={preserveAspectRatio} >
          <g transform={`translate(${margin.left}, ${margin.top})`}>{children}</g>
          <g className='legend'></g>
        </svg>
      </div>
    );
  }
});

module.exports = Chart;
