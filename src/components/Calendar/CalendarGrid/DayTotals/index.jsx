import React from "react";
import { sortBy } from "lodash";
import { cleanDescription, currency } from "utilities/date-format-utils";
import style from "../MonthTotals/MonthTotals.module.scss";

function DayTotals({ transactions, close }) {
  return (
    <div className={style.totalsContainer}>
      {transactions.length > 0 && (
        <div className={style.closeDay} onClick={close}>
          X
        </div>
      )}
      <ul>
        {sortBy(transactions, "amount")
          .reverse()
          .map(({ amount, description }, idx) => (
            <li className={style.dayDescription} key={idx}>
              <span>{cleanDescription(description)}</span>
              <span>{currency(amount)}</span>
            </li>
          ))}
      </ul>
    </div>
  );
}

export default DayTotals;
