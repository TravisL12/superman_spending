import React, { Component } from "react";
import { formatDate } from "../../utilities/formatLocales";
import styles from "../YearSelector/YearSelector.module.scss"; // just share the styles for now
import { NavLink } from "react-router-dom";

class MonthSelector extends Component {
  constructor(props) {
    super();
    this.state = {
      year: props.match.params.year
    };
  }

  componentWillReceiveProps(newProps) {
    this.setState({ year: newProps.match.params.year });
  }

  render() {
    const months = Array.from({ length: 12 }, (v, k) => k + 1);
    const { year } = this.state;

    return (
      <div className={styles.months}>
        {months.map(num => {
          return (
            <NavLink
              activeClassName={styles.active}
              to={`/calendar/${year}/${num}`}
              key={`month-${num}`}
            >
              <div className={styles.singleItem}>
                {formatDate(num - 1, year, { month: "long" })}
              </div>
            </NavLink>
          );
        })}
      </div>
    );
  }
}

export default MonthSelector;
