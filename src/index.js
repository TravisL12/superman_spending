import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "./index.css";
import withAuth from "./middleware/withAuth";

import Login from "./components/Login";
import Profile from "./components/Profile";

ReactDOM.render(
  <Router>
    <div className="app">
      <div className="app-container">
        <Route exact path="/login" component={Login} />
        <Route exact path="/" component={withAuth(Profile)} />
      </div>
    </div>
  </Router>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA

// import * as serviceWorker from "./serviceWorker";
// serviceWorker.unregister();
