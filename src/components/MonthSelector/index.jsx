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
      monthsData: null,
      isLoading: true
    };
  }

  componentWillReceiveProps(newProps) {
    const { year } = newProps.match.params;
    if (year !== this.state.year) {
      this.fetch(year);
    }
  }

  componentWillMount() {
    this.fetch(this.state.year);
  }

  fetch(year) {
    AuthService.fetch(`api/transactions/yearly/${year}`).then(
      ({ transactions }) => {
        this.setState({
          year,
          monthsData: transactions[year],
          isLoading: false
        });
      }
    );
  }

  render() {
    const monthInts = Array.from({ length: 12 }, (v, k) => k + 1);
    const { year, monthsData, isLoading } = this.state;

    if (isLoading) {
      return <div />;
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
            const propMonth = props.match.params.month;
            return (
              <CalendarGrid {...props} monthsData={monthsData[propMonth]} />
            );
          }}
        />
      </Fragment>
    );
  }
}

export default MonthSelector;
