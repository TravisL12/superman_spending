import React, { useState } from "react";
import { sortBy, sumBy, values, orderBy } from "lodash";
import { Link } from "react-router-dom";

import {
  currency,
  formatDate,
  daysOfWeek,
  getToday,
  cleanDescription
} from "utilities/date-format-utils";
import style from "./CalendarGrid.module.scss";
import MonthTotals from "./MonthTotals";

function CalendarGrid(props) {
  const [selectedDay, setSelectedDay] = useState(false);
  const [showCategories, setShowCategories] = useState(false);

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
    const today = getToday();
    const comparableDate = new Date(year, month - 1, day).getTime();

    if (comparableDate === today.date.getTime()) {
      return style.today;
    } else if (comparableDate > today.date) {
      return style.futureDay;
    }

    return null;
  }

  function checkSelected(day) {
    return day === selectedDay ? style.selectedDay : null;
  }

  function showDay(day) {
    setSelectedDay(day);
  }

  function closeDay() {
    setSelectedDay(false);
  }

  const selectedDayTransactions = transactionData.days[selectedDay] || [];

  return (
    <div className={style.calendarGrid}>
      {showCategories && (
        <MonthTotals categoryData={categoryData} payeeData={payeeData} />
      )}

      <div className={style.monthName}>
        <Link to={getPrevMonth()}>
          <button className={style.monthChangeArrow}>&#8592;</button>
        </Link>
        <h1>{formatDate(month - 1, year)}</h1>
        <Link to={getNextMonth()}>
          <button className={style.monthChangeArrow}>&#8594;</button>
        </Link>
        <button
          className={style.toggleCategories}
          onClick={() => {
            setShowCategories(!showCategories);
          }}
        >
          {showCategories ? "Hide" : "Show"} Categories
        </button>
      </div>

      {/* Calendar of Days */}
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
              onClick={() => showDay(day)}
              className={[style.day, checkToday(day), checkSelected(day)].join(
                " "
              )}
              key={`spending-${day}`}
            >
              <div className={style.date}>{day}</div>
              <div className={style.dateInfo}>
                <div className={style.total}>{currency(sum)}</div>
                <div className={style.count}>Count {count}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Day Breakdown */}
      {/* <div className={style.dayGrid}>
        {selectedDayTransactions.length > 0 && (
          <div className={style.closeDay} onClick={closeDay}>
            X
          </div>
        )}
        <ul>
          {sortBy(selectedDayTransactions, "amount")
            .reverse()
            .map(({ amount, description }, idx) => (
              <li className={style.dayDescription} key={idx}>
                <span>{cleanDescription(description)}</span>
                <span>{currency(amount)}</span>
              </li>
            ))}
        </ul>
      </div> */}
    </div>
  );
}

export default CalendarGrid;
