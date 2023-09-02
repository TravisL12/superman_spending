import React, { Component, Fragment } from "react";
import AuthService from "../../../middleware/AuthService";
import { formatDate } from "../../../utilities/date-format-utils";
import CalendarGrid from "../CalendarGrid";
import Loading from "../../Loading";
import style from "../Calendar.module.scss";
import { Route, NavLink } from "react-router-dom";

class MonthSelector extends Component {
  state = {
    year: this.props.match.params.year,
    transactionData: null,
    categoryData: null,
    isLoading: true,
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
    if (this.state.year) {
      this.fetch(this.state.year);
    }
  }

  fetch(year) {
    AuthService.fetch(`api/transactions/yearly/${year}`).then(
      ({ transactions, categories }) => {
        this.setState({
          year,
          transactionData: transactions[year],
          categoryData: categories[year],
          isLoading: false,
        });
      }
    );
  }

  render() {
    const monthInts = Array.from({ length: 12 }, (v, k) => k + 1);
    const { year, transactionData, categoryData, isLoading } = this.state;

    if (isLoading) return <Loading />;

    return (
      <Fragment>
        <div className={style.months}>
          {monthInts.map((monthInt) => {
            const formattedDate = formatDate(monthInt - 1, year, {
              month: "long",
            });
            const key = `month-${monthInt}`;

            if (!transactionData[monthInt]) {
              return (
                <div
                  className={`${style.itemContainer} ${style.noData}`}
                  key={key}
                >
                  {formattedDate}
                </div>
              );
            }

            return (
              <NavLink
                className={style.itemContainer}
                activeClassName={style.active}
                to={`/calendar/${year}/${monthInt}`}
                key={key}
              >
                {formattedDate}
              </NavLink>
            );
          })}
        </div>

        <Route
          exact
          path={`${this.props.match.path}/:month`}
          render={(props) => {
            const { month } = props.match.params;

            return (
              <CalendarGrid
                {...props}
                transactionData={transactionData[month]}
                categoryData={categoryData[month]}
              />
            );
          }}
        />
      </Fragment>
    );
  }
}

export default MonthSelector;
