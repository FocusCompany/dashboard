import { toast } from "react-toastify";
//import 'react-toastify/dist/ReactToastify.css';
import $ from "jquery";

const APIRoot = "http://auth.thefocuscompany.me:3000/api/v1";

/*export const Toast = {
  error: text => console.error(text),
  info: text => console.info(text),
  warn: text => console.warn(text),
  success: text => console.log(text)
};*/

export const Toast = {
  error: text => toast.error(text),
  info: text => toast.info(text),
  success: text => toast.success(text),
  warning: text => toast.warn(text)
};

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

export function ellipsizeText(text) {
  const length = 30;
  if (text == null) {
    return "";
  }
  if (text.length <= length) {
    return text;
  }
  text = text.substring(0, length);
  const last = text.lastIndexOf(" ");
  text = text.substring(0, last);
  return text + "...";
}

export function getTimeFromSeconds(sec_num) {
  var hours = Math.floor(sec_num / 3600) % 24;
  var minutes = Math.floor(sec_num / 60) % 60;
  var seconds = Math.floor(sec_num) % 60;
  let time = "";
  if (hours > 0) {
    time += `${hours}h `;
  }
  if (minutes > 0) {
    time += `${minutes}m `;
  }
  if (time === "" || seconds > 0) {
    time += `${seconds}s`;
  }
  return time;
}

export function callAPI(endpoint, data, method, extraHeaders, bearer) {
  // API Promise "Generator"
  if (bearer === true && extraHeaders !== null)
    extraHeaders.Authorization = "Bearer " + localStorage.token;
  else if (bearer === true)
    extraHeaders = { Authorization: "Bearer " + localStorage.token };

  return $.ajax({
    type: method || "POST",
    headers: extraHeaders,
    url: APIRoot + endpoint,
    crossDomain: true,
    data: data,
    dataType: "json"
  });
}

export function callRenewAPI(endpoint, data, method, extraHeaders, bearer) {
  return new Promise((resolve, reject) => {
    callAPI(endpoint, data, method, extraHeaders, bearer)
      .then(res => {
        console.log("Token seems valid");
        resolve(res);
      })
      .catch(err => {
        console.log("Token expired, attempting to renew");
        callAPI("/renew_jwt", { token: localStorage.token }, "POST")
          .then(res => {
            localStorage.token = res.token;
            console.log("Token renewed");
            callAPI(endpoint, data, method, extraHeaders, bearer)
              .then(res => {
                console.log("Second request attempt");
                resolve(res);
              })
              .catch(err => {
                console.log("Second request failed");
                reject(err);
              });
          })
          .catch(err => {
            console.log("Token renewal rejected");
            reject(err);
          });
      });
  });
}

export function sameDay(d1, d2) {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

export function camelToSnake(str) {
  return str.replace(/[A-Z]/g, m => "_" + m.toLowerCase());
}
