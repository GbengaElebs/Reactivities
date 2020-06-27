import React from "react";
import ReactDOM from "react-dom";
import App from "./app/layout/App";
import * as serviceWorker from "./serviceWorker";
import "./app/layout/styles.css";
import { BrowserRouter } from "react-router-dom";
import ScrollToTop from './app/layout/ScollToTop';

ReactDOM.render(
  <BrowserRouter>
    <ScrollToTop/>
    <App />
  </BrowserRouter>,
  document.getElementById("root")
);
/// render the app component but where? where it is in root

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
