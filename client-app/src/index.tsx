import React from "react";
import ReactDOM from "react-dom";
import App from "./app/layout/App";
import * as serviceWorker from "./serviceWorker";
import "./app/layout/styles.css";
import 'react-toastify/dist/ReactToastify.min.css'
import { Router } from "react-router-dom";
import { createBrowserHistory } from "history";
import ScrollToTop from './app/layout/ScollToTop';
import 'react-widgets/dist/css/react-widgets.css';
import 'semantic-ui-css/semantic.min.css';
import dateFnsLocalizer from 'react-widgets-date-fns';
import 'mobx-react-lite/batchingForReactDom';

dateFnsLocalizer();


export const history = createBrowserHistory();

ReactDOM.render(
  <Router history={history}>
    <ScrollToTop/>
    <App />
  </Router>,
  document.getElementById("root")
);
/// render the app component but where? where it is in root

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
