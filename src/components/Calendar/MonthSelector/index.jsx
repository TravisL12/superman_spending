import React, { Component, Fragment } from "react";
import AuthService from "middleware/AuthService";
import { formatDate } from "utilities/date-format-utils";
import CalendarGrid from "components/Calendar/CalendarGrid";
import styles from "components/Calendar/Selector.module.scss";
import { Route, NavLink } from "react-router-dom";

class MonthSelector extends Component {
  state = {
    year: this.props.match.params.year,
    transactionData: null,
    categoryData: null,
    isLoading: true
  };

  componentWillReceiveProps(newProps) {
    const { year } = newProps.match.params;
    if (year !== this.state.year) {
      this.setState({ isLoading: true }, () => {
        this.fetch(year);
      });
    }
  }

  componentWillMount() {
    this.fetch(this.state.year);
  }

  fetch(year) {
    AuthService.fetch(`api/transactions/yearly/${year}`).then(
      ({ transactions, categories }) => {
        this.setState({
          year,
          transactionData: transactions[year],
          categoryData: categories[year],
          isLoading: false
        });
      }
    );
  }

  render() {
    const monthInts = Array.from({ length: 12 }, (v, k) => k + 1);
    const { year, transactionData, categoryData, isLoading } = this.state;

    if (isLoading) return null;

    return (
      <Fragment>
        <div className={styles.months}>
          {monthInts.map(monthInt => {
            const formattedDate = formatDate(monthInt - 1, year, {
              month: "long"
            });
            const key = `month-${monthInt}`;

            if (!transactionData[monthInt]) {
              return (
                <div className={styles.itemContainer} key={key}>
                  <div className={`${styles.singleItem} ${styles.noData}`}>
                    {formattedDate}
                  </div>
                </div>
              );
            }

            return (
              <NavLink
                className={styles.itemContainer}
                activeClassName={styles.active}
                to={`/calendar/${year}/${monthInt}`}
                key={key}
              >
                <div className={styles.singleItem}>{formattedDate}</div>
              </NavLink>
            );
          })}
        </div>
        <Route
          exact
          path={`${this.props.match.path}/:month`}
          render={props => {
            const propMonth = props.match.params.month;
            return (
              <CalendarGrid
                {...props}
                transactionData={transactionData[propMonth]}
                categoryData={categoryData[propMonth]}
              />
            );
          }}
        />
      </Fragment>
    );
  }
}

export default MonthSelector;
