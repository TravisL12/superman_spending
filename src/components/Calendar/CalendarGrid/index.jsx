import React, { useState } from "react";
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
  const [selectedDay, setSelectedDay] = useState([]);

  const {
    match: {
      params: { year, month }
    },
    transactionData
  } = props;
  const categoryData = orderBy(values(props.categoryData), ["sum"], ["desc"]);
  const payeeData = orderBy(values(transactionData.payees), ["sum"], ["desc"]);
  const days = buildDays(year, month);

  function buildDays(year, month) {
    const totalDays = new Date(year, month, 0).getDate();
    const startDow = new Date(year, month - 1, 1).getDay(); // not sure I totally understand the month-1 but whatever
    const days = Array.from({ length: totalDays }, (v, k) => k + 1);
    const dayPadding = new Array(startDow).fill(null);
    return dayPadding.concat(days);
  }

  function getNextMonth() {
    const isNextYear = +month + 1 > 12;
    const nextMonth = isNextYear ? 1 : +month + 1;
    const nextYear = isNextYear ? +year + 1 : +year;
    return `/calendar/${nextYear}/${nextMonth}`;
  }

  function getPrevMonth() {
    const isPrevYear = +month - 1 === 0;
    const nextMonth = isPrevYear ? 12 : +month - 1;
    const nextYear = isPrevYear ? +year - 1 : +year;
    return `/calendar/${nextYear}/${nextMonth}`;
  }

  function checkToday(day) {
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
  }

  function showDay(amount) {
    setSelectedDay(amount);
  }

  function closeDay() {
    setSelectedDay([]);
  }

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
              onClick={() => showDay(spentDay)}
              className={`${style.day} ${checkToday(day)}`}
              key={`spending-${day}`}
            >
              <div className={style.date}>{day}</div>
              <div>
                <div className={style.total}>{currency(sum)}</div>
                <div className={style.count}>{count}</div>
              </div>
            </div>
          );
        })}
      </div>
      <div className={style.dayGrid}>
        {selectedDay.length > 0 && (
          <div className={style.closeDay} onClick={closeDay}>
            X
          </div>
        )}
        <ul>
          {selectedDay.map(({ amount, description }, idx) => (
            <li key={idx}>
              <span>{description}</span>
              <span>{currency(amount)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default CalendarGrid;
