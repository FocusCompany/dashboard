import React, { Component } from 'react';
import { callRenewAPI, Toast } from  './Util';

import PieGraph from './PieGraph';
import ColumnGraph from './ColumnGraph';
import BarGraph from './BarGraph';
import HalfPieGraph from './HalfPieGraph';
// import Calendar from './Calendar';
import CalendarHeatmapGraph from './CalendarHeatmapGraph';

import GraphData from './GraphData';

/* Dummy data
let DATA = [
	{process: 'chrome', length: 1200},
	{process: 'word', length: 600},
	{process: 'visual studio code', length: 1400},
	{process: 'skype', length: 800}
]

let SUMMARY = [
	{name: "Activity", value: 80, percent: 80},
	{name: "Idle", value: 20, percent: 20}
]

let HEATMAP = [
	{
		date: "2018-08-11",
		details: [{name: 'word', date: "2018-08-11 12:34:56", value: 10000}],
		summary: [{name: 'word', value: 10000}],
		total: 10000
	},
	{
		date: "2018-08-12",
		details: [{name: 'chrome', date: "2018-08-12 13:55:22", value: 25000}, {name: 'visual studio code', date: "2018-08-12 13:42:42", value: 30000}],
		summary: [{name: 'chrome', value: 25000}, {name: 'visual studio code', value: 30000}],
		total: 55000
	},
	{
		date: "2018-08-13",
		details: [{name: 'chrome', date: "2018-08-13 10:18:11", value: 15000}, {name: 'chrome', date: "2018-08-13 18:05:11", value: 10000}, {name: 'visual studio code', date: "2018-08-13 18:06:42", value: 12000}, {name: 'skype', date: "2018-08-13 17:06:32", value: 8000}],
		summary: [{name: 'chrome', value: 30000}, {name: 'visual studio code', value: 12000}, {name: 'skype', value: 8000}],
		total: 50000
	}
]
*/

export default class Home extends Component {
	constructor(props) {
		super(props);

		this.state = {
			devices: [],
			device: 0,
			calendar: [], // Calendar data
			total: [], // Processes data, pie and bar for now
			heatmap: [], // Heatmap data
			summary: [] // Idle vs activity half pie
		}

		this.refreshData = this.refreshData.bind(this);
		this.selectDevice = this.selectDevice.bind(this);
	}

	refreshData() {
		console.log(this.state.device, this.state.devices[this.state.device]);
		if (this.state.devices[this.state.device]) {
			const options = { device: this.state.devices[this.state.device].id_devices, start: 0, end: Math.floor(Date.now() / 1000) };
			GraphData.get('total', options, true).then(t_data => {
				GraphData.get('heatmap', options).then(h_data => {
					GraphData.get('summary', options).then(s_data => {
						console.log(h_data);
						this.setState({ summary: s_data, heatmap: h_data, total: t_data });
					});
				});
			});
		} else {
			console.log(`Invalid device index ${this.state.device}`);
		}
	}

	componentDidMount() {
		callRenewAPI('/get_devices', null, 'GET', null, true)
		.then(res => {
			this.setState({devices: res.devices});
			this.refreshData();
		})
		.catch(err => {
			console.log(err);
			Toast.error("Could not get device list");
		});
	}

	selectDevice(event) {
		event.preventDefault();
		// eslint-disable-next-line
		this.state.device = parseInt(event.target.value, 10);
		this.setState({device: parseInt(event.target.value, 10)});
		this.refreshData();
	}

	render() {
		return (
		<div className="container">
			<div className="row justify-content-md-center">			
				<div className="col-12">
					<div className="card bg-light mb-3">
					<div className="card-header">Device</div>
						<div className="card-body">
							<div className="form-group">
								<select onChange={this.selectDevice} className="form-control" id="selectDevice" value={this.state.device}>
									{this.state.devices.map((e, i) => <option value={i} key={i}>{`${e.devices_name}${e.collections_name ? ` (${e.collections_name})` : ``}`}</option>)}
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
			<div className="row justify-content-between">
				<div className="col-5">
					<div className="card bg-light mb-3">
						<div className="card-header">Total time spent</div>
						<div className="card-body">
							{ this.state.total.length > 0 ? <PieGraph data={this.state.total} height="300px"/> : "No total data" }
						</div>
					</div>
				</div>
				<div className="col-5">
					<div className="card bg-light mb-3">
						<div className="card-header">Activity Summary</div>
						<div className="card-body">
							{ this.state.total.length > 0 ? <HalfPieGraph data={this.state.summary} height="300px"/> : "No summary data" }
						</div>
					</div>
				</div>
			</div>
			<div className="row justify-content-md-center">
				<div className="col-12">
					<div className="card bg-light mb-3">
						<div className="card-header">Process Activity</div>
						<div className="card-body">
							{ this.state.total.length > 0 ? <ColumnGraph data={this.state.total} height="300px"/> : "No process activity data" }
						</div>
					</div>
				</div>
			</div>
			<div className="row justify-content-md-center">
				<div className="col-12">
					<div className="card bg-light mb-3">
						<div className="card-header">Process Activity</div>
						<div className="card-body">
							{ this.state.total.length > 0 ? <BarGraph data={this.state.total} height="300px"/> : "No process activity data" }
						</div>
					</div>
				</div>
			</div>
		</div>);
	}
}