import React, { Component } from "react";
import { sumBy } from "lodash";
import {
  currency,
  formatDate,
  daysOfWeek
} from "../../utilities/formatLocales";
import style from "./CalendarGrid.module.scss";

class CalendarGrid extends Component {
  buildDays(year, month) {
    const totalDays = new Date(year, month - 1, 0).getDate();
    const startDow = new Date(year, month - 1, 1).getDay();
    const days = Array.from({ length: totalDays }, (v, k) => k + 1);
    const dayPadding = new Array(startDow).fill(null);
    return dayPadding.concat(days);
  }

  render() {
    const { year, month } = this.props.match.params;
    const { monthsData } = this.props;
    const days = this.buildDays(year, month);

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
                return <div key={`week-pad-${idx}`} />;
              }

              const spentDay = monthsData[month][day];
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
