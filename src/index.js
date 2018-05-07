import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { ToastContainer } from 'react-toastify';

import 'bootstrap/dist/css/bootstrap.min.css';
import './css/dashboard.css';

ReactDOM.render(<div><App /><ToastContainer
	position="bottom-left"
	autoClose={5000}
	hideProgressBar={false}
	newestOnTop={false}
	closeOnClick
	rtl={false}
	pauseOnVisibilityChange
	draggable
	pauseOnHover
/></div>, document.getElementById('root'));
registerServiceWorker();
