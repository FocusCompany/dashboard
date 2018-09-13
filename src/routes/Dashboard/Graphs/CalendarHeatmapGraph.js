import React from 'react';
import CalendarHeatmap from 'reactjs-calendar-heatmap';
import Graph from './Graph';

class CalendarHeatmapGraph extends Graph {
	constructor(props) {
		super(props);
		this.state = {
			width: props.width,
			height: props.height,
			pixelWidth: 0,
			pixelHeight: 0,
			data: props.data,
			overview: props.overview
		}
	}

	render() {
		return (
			<div ref={this.myRef} style={{width: this.state.width, height: this.state.height, overflowX: "auto"}}>
				<CalendarHeatmap
					data={this.state.data}
					overview={this.state.overview}
				/>
			</div>
		);
	}
}

CalendarHeatmapGraph.defaultProps = {
	overview: 'year'
}

export default CalendarHeatmapGraph;
