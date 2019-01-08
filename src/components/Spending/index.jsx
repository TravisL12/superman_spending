import React, { Component } from "react";
import AuthService from "../../middleware/AuthService";
import { sumBy } from "lodash";
import { currency, formatDate } from "../../utilities/formatLocales";

class Spending extends Component {
  constructor(props) {
    super();
    const date = new Date();
    const year = +props.match.params.year || date.getFullYear();
    const month = +props.match.params.month || date.getMonth() + 1;

    this.state = {
      transactions: {},
      isLoading: true,
      year,
      month
    };
  }

  componentWillMount() {
    AuthService.fetch("api/user/profile").then(({ transactions }) => {
      this.setState({ transactions, isLoading: false });
    });
  }

  render() {
    const { transactions, isLoading, year, month } = this.state;

    if (isLoading) {
      return <h1>Loading...</h1>;
    }

    const totalDays = new Date(year, month - 1, 0).getDate();
    const days = Array.from({ length: totalDays }, (v, k) => k + 1);
    const spending = transactions[year][month];

    return (
      <div>
        <h1>{formatDate(month - 1, year)}</h1>
        <div>
          {days.map(day => {
            const spentDay = spending[day];
            const count = spentDay ? spentDay.length : 0;
            const sum = spentDay ? sumBy(spentDay, "amount") : 0;

            return (
              <p key={`spending-${day}`}>
                {day} - {currency(sum)} ({count})
              </p>
            );
          })}
        </div>
      </div>
    );
  }
}

export default Spending;
