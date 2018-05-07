import React, { Component } from 'react';
import { getGraphData, callRenewAPI, Toast } from  './Util';
import PieGraph from './PieGraph';
import ColumnGraph from './ColumnGraph';
import BarGraph from './BarGraph';

export default class Home extends Component {
	constructor(props) {
		super(props);

		this.state = {
			devices: [],
			device: -1
		}
	}

	componentDidMount() {
		callRenewAPI('/get_devices', null, 'GET', null, true)
		.then(res => {
			this.setState({devices: res.devices});
			console.log(res.devices);
		})
		.catch(err => {
			console.log(err);
			Toast.error("Could not get device list: " + err);
		});
	}

	render() {
		const data = getGraphData();

		console.log(data);

		return (
		<div className="container">
			<div className="row justify-content-md-center">			
				<div className="col-12">
					<div className="card bg-light mb-3">
						<div className="card-body">
							<div class="form-group">
								<select class="form-control" id="selectDevice">
									{this.state.devices.map(e => <option>{`${e.devices_name} (${e.collections_name})`}</option>)}
								</select>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="row justify-content-md-center">
				<div className="col-5">
					<div className="card bg-light mb-3">
						<div className="card-header">Recent Activities</div>
						<div className="card-body">
							<PieGraph data={data} height="300px"/>
						</div>
					</div>
				</div>
				<div className="col-7">
					<div className="card bg-light mb-3">
						<div className="card-header">Recent Activities</div>
						<div className="card-body">
							<ColumnGraph data={data} height="300px"/>
						</div>
					</div>
				</div>
			</div>
			<div className="row justify-content-md-center">
				<div className="col-12">
					<div className="card bg-light mb-3">
						<div className="card-header">Recent Activities</div>
						<div className="card-body">
							<BarGraph data={data} height="300px"/>
						</div>
					</div>
				</div>
			</div>
		</div>);
	}
}