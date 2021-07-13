// import './wdyr';
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import register from "./registerServiceWorker";

ReactDOM.render(<App />, document.getElementById("root")); // eslint-disable-line react/jsx-filename-extension
register();
