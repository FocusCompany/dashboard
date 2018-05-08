import React from 'react';
import { ComposedChart, Bar, XAxis, YAxis, LabelList } from 'recharts';
import Graph from './Graph';

function getFont() {
	const div = document.querySelector('body');
	const style = window.getComputedStyle(div);
	return style.getPropertyValue('font-size') + ' ' + style.getPropertyValue('font-family');
}
  
function getTextWidth(text) {
	var canvas = document.createElement('canvas');
	const context = canvas.getContext('2d');
	context.font = getFont();
	const metric = context.measureText(text);
	return Math.ceil(metric.width * 1.1); // measureText method's return value may be slightly underestimated, add some pixels or scale it
}

class BarGraph extends Graph {
	render() {
		var maxWidth = 0;
		var tmpWidth = 0;
		for (var i = 0; i < this.state.data.length; i++) {
			tmpWidth = getTextWidth(this.state.data[i].process);
			if (tmpWidth > maxWidth) {
				maxWidth = tmpWidth;
			}
		}
		return (
			<div id="bar-graph" ref={this.myRef} style={{width: this.state.width, height: this.state.height}}>
				<ComposedChart layout="vertical" width={this.state.pixelWidth} height={this.state.pixelHeight} data={this.state.data} margin={{top: 20, right: 20, bottom: 20, left: 20}}>
					<XAxis type="number"/>
					<YAxis dataKey="process" type="category" width={maxWidth}/>
					<Bar dataKey="length" fill="#8884d8">
						<LabelList dataKey="length" position="insideRight" />
					</Bar>
				</ComposedChart>
			</div>
		);
	}
}

export default BarGraph;