import React from "react";
import { sumBy, values, orderBy } from "lodash";
import {
  currency,
  formatDate,
  daysOfWeek
} from "../../../utilities/formatLocales";
import style from "./CalendarGrid.module.scss";

function CalendarGrid(props) {
  const buildDays = (year, month) => {
    const totalDays = new Date(year, month, 0).getDate();
    const startDow = new Date(year, month - 1, 1).getDay(); // not sure I totally understand the month-1 but whatever
    const days = Array.from({ length: totalDays }, (v, k) => k + 1);
    const dayPadding = new Array(startDow).fill(null);
    return dayPadding.concat(days);
  };

  const calcColor = sum => {
    switch (true) {
      case sum > 3000:
        return style.amount3000;
      case sum > 2000:
        return style.amount2000;
      case sum > 1000:
        return style.amount1000;
      case sum < 50:
        return style.amount50;
      case sum < 100:
        return style.amount100;
      default:
        return style.amount;
    }
  };

  const { year, month } = props.match.params;
  const { transactionData } = props;
  const categoryData = orderBy(values(props.categoryData), ["sum"], ["desc"]);
  const categoryTotal = categoryData.reduce((sum, data) => {
    sum += data.sum;
    return sum;
  }, 0);
  const days = buildDays(year, month);

  return (
    <div className={style.calendar}>
      <div className={style.categories}>
        <ul>
          {categoryData.map((data, idx) => {
            return (
              <li key={idx}>
                <span className={style.name}>{data.name}</span>
                <span className={style.sum}>
                  {currency(data.sum, {
                    minimumFractionDigits: 0,
                    rounded: true
                  })}
                </span>
              </li>
            );
          })}
          <li className={style.categoryTotal}>
            <span className={style.name}>Total</span>
            <span className={style.sum}>
              {currency(categoryTotal, {
                minimumFractionDigits: 0,
                rounded: true
              })}
            </span>
          </li>
        </ul>
      </div>

      <div className={style.monthName}>
        <h1>{formatDate(month - 1, year)}</h1>
      </div>

      <div className={style.monthGrid}>
        {daysOfWeek.map(dow => {
          return (
            <span key={dow} className={style.dow}>
              {dow}
            </span>
          );
        })}

        {days.map((day, idx) => {
          if (!day) return <div key={`week-pad-${idx}`} />;

          const spentDay = transactionData[day];
          const count = spentDay ? spentDay.length : 0;
          const sum = spentDay ? sumBy(spentDay, "amount") : 0;

          return (
            <div
              className={`${style.day} ${calcColor(sum / 100)}`}
              key={`spending-${day}`}
            >
              <div className={style.date}>{day}</div>
              <div>
                <div className={style.total}>{currency(sum)}</div>
                <div className={style.count}>Count: {count}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CalendarGrid;
