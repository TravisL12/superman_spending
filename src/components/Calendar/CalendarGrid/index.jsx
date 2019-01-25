import React from "react";
import { sumBy, values, orderBy } from "lodash";
import {
  currency,
  formatDate,
  daysOfWeek
} from "../../../utilities/formatLocales";
import style from "./CalendarGrid.module.scss";
import SideColumn from "./SideColumn";
import { Link } from "react-router-dom";

function CalendarGrid(props) {
  const buildDays = (year, month) => {
    const totalDays = new Date(year, month, 0).getDate();
    const startDow = new Date(year, month - 1, 1).getDay(); // not sure I totally understand the month-1 but whatever
    const days = Array.from({ length: totalDays }, (v, k) => k + 1);
    const dayPadding = new Array(startDow).fill(null);
    return dayPadding.concat(days);
  };

  const getNextMonth = () => {
    const nextMonth = +month + 1 > 12 ? 1 : +month + 1;
    const nextYear = +month + 1 > 12 ? +year + 1 : +year;
    return `/calendar/${nextYear}/${nextMonth}`;
  };

  const getPrevMonth = () => {
    const nextMonth = +month - 1 === 0 ? 12 : +month - 1;
    const nextYear = +month - 1 === 0 ? +year - 1 : +year;
    return `/calendar/${nextYear}/${nextMonth}`;
  };

  const checkToday = day => {
    const today = new Date();
    today.setHours(0); // this is janky af
    today.setMinutes(0);
    today.setSeconds(0);
    today.setMilliseconds(0);
    const comparableDate = new Date(year, month - 1, day).getTime();

    if (comparableDate === today.getTime()) {
      return style.today;
    } else if (comparableDate > today) {
      return style.futureDay;
    }

    return "";
  };

  const { year, month } = props.match.params;
  const { transactionData } = props;
  const categoryData = orderBy(values(props.categoryData), ["sum"], ["desc"]);
  const payeeData = orderBy(values(transactionData.payees), ["sum"], ["desc"]);
  const days = buildDays(year, month);

  return (
    <div className={style.calendar}>
      <SideColumn categoryData={categoryData} payeeData={payeeData} />

      <div className={style.monthName}>
        <h1>{formatDate(month - 1, year)}</h1>
        <div className={style.changeMonth}>
          <Link to={getPrevMonth()}>
            <button>Previous</button>
          </Link>
          <Link to={getNextMonth()}>
            <button>Next</button>
          </Link>
        </div>
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

          const spentDay = transactionData.days[day];
          const count = spentDay ? spentDay.length : 0;
          const sum = spentDay ? sumBy(spentDay, "amount") : 0;

          return (
            <div
              className={`${style.day} ${checkToday(day)}`}
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
