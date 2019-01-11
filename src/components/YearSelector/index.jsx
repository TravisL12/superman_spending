import React, { Component, Fragment } from "react";
import styles from "./YearSelector.module.scss";
import MonthSelector from "../MonthSelector";
import { Route, NavLink } from "react-router-dom";

class YearSelector extends Component {
  render() {
    const { years } = this.props;

    return (
      <Fragment>
        <div className={styles.years}>
          {years.map(year => {
            return (
              <NavLink
                className={styles.itemContainer}
                activeClassName={styles.active}
                to={`/calendar/${year}`}
                key={year}
              >
                <div className={styles.singleItem} key={year}>
                  {year}
                </div>
              </NavLink>
            );
          })}
        </div>
        <Route
          path="/calendar/:year"
          render={props => {
            return <MonthSelector {...props} />;
          }}
        />
      </Fragment>
    );
  }
}

export default YearSelector;
