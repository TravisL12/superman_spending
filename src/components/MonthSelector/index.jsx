import React, { Component, Fragment } from "react";
import AuthService from "../../middleware/AuthService";
import { formatDate } from "../../utilities/formatLocales";
import CalendarGrid from "../CalendarGrid";
import styles from "../YearSelector/YearSelector.module.scss";
import { Route, NavLink } from "react-router-dom";

class MonthSelector extends Component {
  constructor(props) {
    super();
    this.state = {
      year: props.match.params.year,
      monthsData: null
    };
  }

  componentWillReceiveProps(newProps) {
    if (newProps.match.params.year !== this.state.year) {
      this.fetch(newProps.match.params);
    }
  }

  componentWillMount() {
    this.fetch(this.state);
  }

  fetch({ year }) {
    AuthService.fetch(`api/transactions/yearly/${year}`).then(
      ({ transactions }) => {
        this.setState({ year, monthsData: transactions[year] });
      }
    );
  }

  render() {
    const monthInts = Array.from({ length: 12 }, (v, k) => k + 1);
    const { year, monthsData } = this.state;

    if (!monthsData) {
      return <p />;
    }

    return (
      <Fragment>
        <div className={styles.months}>
          {monthInts.map(num => {
            if (!monthsData[num]) {
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
        <Route
          exact
          path="/calendar/:year/:month"
          render={props => {
            return <CalendarGrid {...props} monthsData={monthsData} />;
          }}
        />
      </Fragment>
    );
  }
}

export default MonthSelector;
