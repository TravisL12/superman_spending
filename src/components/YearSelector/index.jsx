import React, { Component } from "react";
import styles from "./YearSelector.module.scss";
import { NavLink } from "react-router-dom";

class YearSelector extends Component {
  render() {
    const { years } = this.props;

    return (
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
    );
  }
}

export default YearSelector;
