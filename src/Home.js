import React, { Component } from 'react';
import { callRenewAPI, Toast } from  './Util';

import PieGraph from './PieGraph';
import ColumnGraph from './ColumnGraph';
import BarGraph from './BarGraph';
// import Calendar from './Calendar';
import CalendarHeatmapGraph from './CalendarHeatmapGraph';

import GraphData from './GraphData';

export default class Home extends Component {
	constructor(props) {
		super(props);

		this.state = {
			devices: [],
			device: -1,
			calendar: [], // Calendar data
			total: [], // Processes data, pie and bar for now
			heatmap: [], // Heatmap data
		}

		this.refreshData = this.refreshData.bind(this);
	}

	refreshData() {
		const total = GraphData.get('total');
		const heatmap = GraphData.get('heatmap');

		this.setState({ total: total, heatmap: heatmap });
	}

	componentDidMount() {
		callRenewAPI('/get_devices', null, 'GET', null, true)
		.then(res => {
			this.setState({devices: res.devices});
		})
		.catch(err => {
			Toast.error("Could not get device list: " + err);
		});

		this.refreshData();
	}

	render() {
		return (
		<div className="container">
			<div className="row justify-content-md-center">			
				<div className="col-12">
					<div className="card bg-light mb-3">
						<div className="card-body">
							<div className="form-group">
								<select className="form-control" id="selectDevice">
									{this.state.devices.map(e => <option key={`${e.id_devices}/${e.id_collections}`}>{`${e.devices_name} (${e.collections_name})`}</option>)}
								</select>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="row justify-content-md-center">
				<div className="col-12">
					<div className="card bg-light mb-3">
						<div className="card-header">Calendar Heatmap</div>
						<div className="card-body">
							{ this.state.heatmap.length > 0 ? <CalendarHeatmapGraph data={this.state.heatmap}/> : 'No heatmap data' }
						</div>
					</div>
				</div>
			</div>
			<div className="row justify-content-md-center">
				<div className="col-5">
					<div className="card bg-light mb-3">
						<div className="card-header">Total time spent</div>
						<div className="card-body">
							<PieGraph data={this.state.total} height="300px"/>
						</div>
					</div>
				</div>
				<div className="col-7">
					<div className="card bg-light mb-3">
						<div className="card-header">Recent Activities</div>
						<div className="card-body">
							<ColumnGraph data={this.state.total} height="300px"/>
						</div>
					</div>
				</div>
			</div>
			<div className="row justify-content-md-center">
				<div className="col-12">
					<div className="card bg-light mb-3">
						<div className="card-header">Recent Activities</div>
						<div className="card-body">
							<BarGraph data={this.state.total} height="300px"/>
						</div>
					</div>
				</div>
			</div>
		</div>);
	}
}