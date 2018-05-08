import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import $ from "jquery";

const APIRoot = "http://auth.thefocuscompany.me:3000/api/v1";

export const Toast = {
	error: (text, title) => toast.error(text),
	info: (text, title) => toast.info(text),
	success: (text, title) => toast.success(text),
	warning: (text, title) => toast.warn(text)
}

/* const Toast = {
	error: (text, title) => toast({
		heading: title || 'Error',
		text: text,
		showHideTransition: 'slide',
		icon: 'error',
		hideAfter: false
	}),
	info: (text, title) => $.toast({
		heading: title || 'Success',
		text: text,
		showHideTransition: 'slide',
		icon: 'info'
	}),
	success: (text, title) => $.toast({
		heading: 'Success',
		text: text,
		showHideTransition: 'slide',
		icon: 'success'
	})
} */

export function callAPI(endpoint, data, method, extraHeaders, bearer) { // API Promise "Generator"
	if (bearer === true && extraHeaders !== null)
		extraHeaders.Authorization = ('Bearer ' + localStorage.token);
	else if (bearer === true)
		extraHeaders = { 'Authorization': ('Bearer ' + localStorage.token) };

	console.log(method);

	return ($.ajax({
		type: method || 'POST',
		headers: extraHeaders,
		url: APIRoot + endpoint,
		crossDomain: true,
		data: data,
		dataType: 'json'
	}));
}

export function callRenewAPI(endpoint, data, method, extraHeaders, bearer) {
	return new Promise((resolve, reject) => {
		callAPI(endpoint, data, method, extraHeaders, bearer)
		.then(res => {
			console.log("Token seems valid");
			resolve(res);
		}).catch(err => {
			console.log("Token expired, attempting to renew");
			callAPI('/renew_jwt', {token: localStorage.token}, 'POST')
			.then(res => {
				localStorage.token = res.token;
				console.log("Token renewed");
				callAPI(endpoint, data, method, extraHeaders, bearer)
				.then(res => {
					console.log("Second request attempt");
					resolve(res);
				}).catch(err => {
					console.log("Second request failed");
					reject(err);
				})
			}).catch((err => {
				console.log("Token renewal rejected");
				reject(err);
			}));
		});
	});
}

export function sameDay(d1, d2) {
	return d1.getFullYear() === d2.getFullYear() &&
		d1.getMonth() === d2.getMonth() &&
		d1.getDate() === d2.getDate();
}

export function getGraphData(options) {
	options = options || {};
	return [
		{
			process: "notepad.exe",
			length: 120
		},
		{
			process: "firefox.exe",
			length: 180
		}    
	]
}

export function camelToSnake(str) {
	return str.replace(/[A-Z]/g, (m) => '_' + m.toLowerCase());
}