import React from "react";
import ReactDOM from "react-dom";
import { Redirect, BrowserRouter, Route, withRouter } from "react-router-dom";
import withAuth from "./middleware/withAuth";
import CategoriesProvider from "./providers/CategoriesProvider";

// Absolute paths set in .env file (NODE_PATH=src)
import Header from "./components/Header/";
import Login from "./components/Login/";
import Calendar from "./components/Calendar/";
import Categories from "./components/Categories/";
import Transactions from "./components/Transactions/";

import styles from "./index.module.scss";
import { getToday } from "./utilities/date-format-utils";

const WrappedHeader = withRouter(Header);

ReactDOM.render(
  <CategoriesProvider>
    <BrowserRouter>
      <div className={styles.app}>
        <div className={styles.appContainer}>
          <Route path="/" component={WrappedHeader} />
          <Route
            path="/"
            exact
            render={() => {
              const { year, month } = getToday();
              return <Redirect to={`/calendar/${year}/${month}`} />;
            }}
          />
          <Route
            path="/calendar"
            exact
            render={() => {
              const { year, month } = getToday();
              return <Redirect to={`/calendar/${year}/${month + 1}`} />;
            }}
          />
          <Route path="/calendar" component={withAuth(Calendar)} />
          <Route exact path="/categories" component={withAuth(Categories)} />
          <Route
            exact
            path="/transactions/:page?"
            component={withAuth(Transactions)}
          />
          <Route exact path="/login" component={Login} />
        </div>
      </div>
    </BrowserRouter>
  </CategoriesProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA

// import * as serviceWorker from "./serviceWorker";
// serviceWorker.unregister();
