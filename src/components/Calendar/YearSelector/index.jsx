import React, { Fragment } from "react";
import styles from "../Selector.module.scss";
import MonthSelector from "../MonthSelector";
import { Route, NavLink } from "react-router-dom";

function YearSelector(props) {
  const { years } = props;

  return (
    <Fragment>
      <div className={styles.years}>
        {years.map(year => {
          return (
            <NavLink
              className={styles.itemContainer}
              activeClassName={styles.active}
              to={`/calendar/${year}/1`}
              key={year}
            >
              <div className={styles.singleItem} key={year}>
                {year}
              </div>
            </NavLink>
          );
        })}
      </div>
      <Route path="/calendar/:year" component={MonthSelector} />
    </Fragment>
  );
}

export default YearSelector;
