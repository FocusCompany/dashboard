import $ from 'jquery';
import { Toast } from './Util';

const stubData = [
	{
		"process": "Gnome-terminal",
		"start": 1525537363000,
		"end": 1525537365000
	},
	{
		"process": "Main.py",
		"start": 1525537360000,
		"end": 1525537369000
	},
	{
		"process": "jetbrains-clion",
		"start": 1525547569000,
		"end": 1525547571000
	},
	{
		"idle": true,
		"start": 1525347569000,
		"end": 1525347571000
	}
];

function getDate(d) {
	return `${d.getFullYear()}-${('00' + d.getMonth()).slice(-2)}-${('00' + d.getDate()).slice(-2)}`
}

function getTime(d) {
	return `${('00' + d.getHours()).slice(-2)}:${('00' + d.getMinutes()).slice(-2)}:${('00' + d.getSeconds()).slice(-2)}`
}

/*
"date": "2016-01-01",
"total": 17164,
	"details": [{
	"name": "Project 1",
	"date": "2016-01-01 12:30:45",
	"value": 9192}]
*/

function makeHeatmapData(data) {
	let global = [];
	data.forEach(e => {
		const date = new Date(e.start);
		const dateStr = getDate(date);
		const timeStr = getTime(date);

		let item = global.find(e => e.date === dateStr);
		if (!item) {
			item = {
				date: dateStr,
				total: 0,
				details: []
			}
			global.push(item);
		}
		item.details.push({
			name: e.idle ? "Idle" : e.process,
			date: `${dateStr} ${timeStr}`,
			value: Math.abs(e.end - e.start)
		})
		item.total += Math.abs(e.end - e.start);
	});
	return global;
}

function makeTotalData(data) {
	let total = [];
	data.forEach(e => {
		if (!e.idle) {
			let item = total.find(i => i.process === (e.idle ? "Idle" : e.process));
			if (!item) {
				item = {
					process: (e.idle ? "Idle" : e.process),
					length: 0
				};
				total.push(item);
			}
			item.length += Math.abs(e.end - e.start);
		}
	});
	return total;
}

function makeActivitySummary(data) {
	let sum = [
		{
			name: 'Activity',
			value: 0
		},
		{
			name: 'Idle',
			value: 0
		}
	];

	let total = 0;

	data.forEach(e => {
		sum[e.idle ? 1 : 0].value += Math.abs(e.end - e.start);
		total += Math.abs(e.end - e.start);
	});

	sum.forEach(e => {
		e.percent = Math.round(e.value / total * 100);
	})
	return sum;
}

const processor = { total: makeTotalData, heatmap: makeHeatmapData, summary: makeActivitySummary };

export default class graphData {
	// Fetch from API
	static fetch(options) {
		return $.ajax({
			type: 'POST',
			url: 'http://backend.thefocuscompany.me:1234/process',
			crossDomain: true,
			data: options,
			dataType: 'json',
			timeout: 5
		});
	}

	// Fecthes() then converts to type
	static get(type, options) {
		return new Promise((resolve, reject) => {
			this.fetch(options).then(data => {
				if (processor[type]) {
					resolve(processor[type](this.data));
				} else {
					reject("Unknown data type");
				}
			}).catch(err => {
				Toast.warning(`Could not fetch data for ${type}, using stub`);
				if (processor[type]) {
					resolve(processor[type](stubData));
				} else {
					reject("Unknown data type");
				}
			})
		})
	}
}