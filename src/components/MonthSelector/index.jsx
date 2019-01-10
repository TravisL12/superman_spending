import React, { Component } from "react";
import AuthService from "../../middleware/AuthService";
import { formatDate } from "../../utilities/formatLocales";
import styles from "../YearSelector/YearSelector.module.scss"; // just share the styles for now
import { NavLink } from "react-router-dom";

class MonthSelector extends Component {
  constructor(props) {
    super();
    this.state = {
      year: props.match.params.year,
      months: {}
    };
  }

  componentWillReceiveProps(newProps) {
    this.fetch(newProps.match.params);
  }

  componentWillMount() {
    this.fetch(this.state);
  }

  fetch({ year }) {
    AuthService.fetch(`api/transactions/yearly/${year}`).then(
      ({ transactions }) => {
        this.setState({ isLoading: false, year, months: transactions[year] });
      }
    );
  }

  render() {
    const monthNums = Array.from({ length: 12 }, (v, k) => k + 1);
    const { year, months } = this.state;

    return (
      <div className={styles.months}>
        {monthNums.map(num => {
          if (!months[num]) {
            return (
              <div className={styles.itemContainer} key={`month-${num}`}>
                <div className={`${styles.singleItem} ${styles.noData}`}>
                  {formatDate(num - 1, year, { month: "long" })}
                </div>
              </div>
            );
          }

          return (
            <NavLink
              className={styles.itemContainer}
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
