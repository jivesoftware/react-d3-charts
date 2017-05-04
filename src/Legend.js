import React, { PropTypes, Component } from 'react';
import d3 from 'd3/d3.min.js';
import color from 'sc-color';
import _ from 'lodash';

class Legend extends Component {

  static propTypes = {
    className: PropTypes.string,
    cellsClassName: PropTypes.string,
    cellClassName: PropTypes.string,
    cellTextClassName: PropTypes.string,
    symbolType: PropTypes.oneOf(['circle', 'cross', 'diamond', 'square', 'triangle-down', 'triangle-up']),
    symbolSize: PropTypes.number,
    symbolOffset: PropTypes.number,
    symbolPosition: PropTypes.string,
    wrapText: PropTypes.bool,
    x: PropTypes.number,
    y: PropTypes.number,
    defaultSymbolColor: PropTypes.string,
    data: PropTypes.arrayOf(PropTypes.object).isRequired
  };

  static defaultProps = {
    className: 'legend',
    cellsClassName: 'cells',
    cellClassName: 'cell',
    cellTextClassName: 'label',
    symbolType: 'circle',
    symbolPosition: 'left',
    symbolSize: 80,
    symbolOffset: 20,
    wrapText: false,
    x: 0,
    y: 0,
    defaultSymbolColor: '#000000'
  };

  componentDidMount() {
    this.updateLegendText();
  }

  componentDidUpdate(prevProps) {
    if (!_.isEqual(this.props, prevProps)){
      this.updateLegendText();
    }
  }

  updateLegendText() {
    const cellClassName = this.props.cellClassName;
    const symbolOffset = this.props.symbolOffset;
    const symbolPosition = this.props.symbolPosition.toLowerCase();

    const wrapper = function(text, width){
      text.each(function(){
        const t = d3.select(this);
        if (!t.attr('data-wrapped')){
          //split words on space, slashes, underscores, or dashes
          const words = t.text().split(/[\s\/_-]+/).reverse();
          if (words.length > 0){
            let line = [];
            let word;
            let lineNumber = 0;
            const lineHeight = 1.1; // ems
            const x = (symbolPosition === 'top') ? '0' : '0.5em';
            const y = (symbolPosition === 'top') ? '0' : '0.4em';
            const dy = 0;
            let textLen = 0;
            let tspan = t.text(null).append('tspan').attr('x', x).attr('y', y).attr('dy', dy + 'em');
            while (word = words.pop()) {
              line.push(word);
              tspan.text(line.join(' '));
              textLen = tspan.node().getComputedTextLength();
              if (textLen > width) {
                if (line.length > 1){
                  line.pop();
                }
                tspan.text(line.join(' '));
                line = [word];
                t.attr('data-wrapped', 'true');
                tspan = t.append('tspan').attr('x', x).attr('y', y).attr('dy', (lineNumber * lineHeight) + dy + 'em').text(word);
                lineNumber += 1;
              }
            }
          }
        }
      });
    };

    const leg = d3.select(this.refs.legend);
    if (this.props.wrapText){
      leg.selectAll('.cell text').call(wrapper, d3.scale.ordinal().domain([]).range([]).rangeBand());
    }

    let textWidthOffset = 0;
    const cells = leg.selectAll('g.' + cellClassName);
    cells.attr('transform', function (d, index) {
      const cell = d3.select(this);
      const symbol = cell.select('path');
      const text = cell.select('text');
      const symbolBox = symbol.node().getBBox();
      const textWidth = text.node().getBBox().width;
      if (symbolPosition === 'top'){
        symbol.attr('transform', `translate(${ textWidth / 2 }, 0)`);
        text.attr('transform', `translate(0, ${ symbolBox.height + symbolOffset })`);
      }
      const translate = `translate(${ (symbolBox.width + symbolOffset * index) + textWidthOffset }, 0)`;
      textWidthOffset += textWidth;
      return translate;
    });
  }

  render() {
    const cells = this.props.data.map((obj, index) =>{
      const symbolPathData = d3.svg.symbol().type(this.props.symbolType).size(this.props.symbolSize)();
      const keys = Object.keys(obj);
      const symbolColor = keys.length ? color(obj[keys[0]]).html() : color(this.props.defaultSymbolColor).html();
      return (
        <g key={ this.props.cellClassName + index } className={this.props.cellClassName} >
          <path d={symbolPathData} style={{ fill: symbolColor }} />
          <text className={this.props.cellTextClassName} textAnchor='start'>
            <tspan x='0.5em' y='0.4em' dy='0em'>{ keys[0] }</tspan>
          </text>
        </g>
      );
    });

    const legendTransform=`translate(${this.props.x}, ${this.props.y})`;
    return (
      <g ref='legend' className={this.props.className}  transform={legendTransform}>
        <g className={this.props.cellsClassName}>
        { cells }
        </g>
      </g>
    );
  }
}

export default Legend;
