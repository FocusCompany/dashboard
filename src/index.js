import React from "react";
import ReactDOM from "react-dom";
import CssBaseline from "@material-ui/core/CssBaseline";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

ReactDOM.render(
  <React.Fragment>
    <CssBaseline />
    <App />
    <ToastContainer />
  </React.Fragment>,
  document.getElementById("root")
);
registerServiceWorker();
