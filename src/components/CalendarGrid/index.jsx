import React, { Component } from "react";
import AuthService from "../../middleware/AuthService";
import { sumBy } from "lodash";
import {
  currency,
  formatDate,
  daysOfWeek
} from "../../utilities/formatLocales";
import style from "./CalendarGrid.module.scss";

class CalendarGrid extends Component {
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

  componentWillReceiveProps(newProps) {
    const { year, month } = newProps.match.params;
    this.fetch(year, month);
  }

  componentWillMount() {
    const { year, month } = this.state;
    this.fetch(year, month);
  }

  fetch(year, month) {
    AuthService.fetch(`api/transactions/monthly/${year}/${month}`).then(
      ({ transactions }) => {
        this.setState({ transactions, isLoading: false, year, month });
      }
    );
  }

  buildDays(year, month) {
    const totalDays = new Date(year, month - 1, 0).getDate();
    const startDow = new Date(year, month - 1, 1).getDay();
    const days = Array.from({ length: totalDays }, (v, k) => k + 1);
    const dayPadding = new Array(startDow).fill(null);
    return dayPadding.concat(days);
  }

  render() {
    const { transactions, isLoading, year, month } = this.state;

    if (isLoading) {
      return <h1>Loading...</h1>;
    }

    const days = this.buildDays(year, month);
    const spending = transactions[year][month];

    return (
      <div className={style.calendar}>
        <div>
          <h1>{formatDate(month - 1, year)}</h1>
          <div className={style.monthGrid}>
            {daysOfWeek.map(dow => {
              return (
                <span key={dow} className={style.dow}>
                  {dow}
                </span>
              );
            })}

            {days.map((day, idx) => {
              if (!day) {
                // padded days to start month
                return <div key={`null-${idx}`} />;
              }

              const spentDay = spending[day];
              const count = spentDay ? spentDay.length : 0;
              const sum = spentDay ? sumBy(spentDay, "amount") : 0;

              return (
                <div className={style.day} key={`spending-${day}`}>
                  {day} - {currency(sum)} ({count})
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default CalendarGrid;
