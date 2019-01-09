import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, withRouter } from "react-router-dom";
import styles from "./index.module.scss";
import withAuth from "./middleware/withAuth";

import Header from "./components/Header/";
import Login from "./components/Login/";
import YearSelector from "./components/YearSelector/";
import Categories from "./components/Categories/";

const WrappedHeader = withRouter(Header);

ReactDOM.render(
  <BrowserRouter>
    <div className={styles.app}>
      <div className={styles.appContainer}>
        <Route path="/" component={WrappedHeader} />
        <Route path="/calendar" component={withAuth(YearSelector)} />
        <Route exact path="/categories" component={withAuth(Categories)} />
        <Route exact path="/login" component={Login} />
      </div>
    </div>
  </BrowserRouter>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA

// import * as serviceWorker from "./serviceWorker";
// serviceWorker.unregister();
