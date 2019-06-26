import React from "react";
import { sumBy, range } from "lodash";
import style from "components/Transactions/TransactionsInputs.module.scss";
import { formatDate, getToday, currency } from "utilities/formatLocales";

function TransactionTotals({ searchResults, removeSearch }) {
  const totals = searchResults.reduce(
    (result, payee) => {
      result.sum += payee.sum;
      result.count += payee.count;
      return result;
    },
    { sum: 0, count: 0 }
  );

  const today = getToday();
  console.log(today);

  return (
    <table className={style.totalsTable}>
      <thead>
        <tr>
          <th className={style.removeBtn} />
          <th className={style.name}>Name</th>
          <th className={style.sum}>Sum</th>
          <th className={style.count}>Count</th>
          {range(today.month + 1, 0).map(i => (
            <th key={i}>
              {formatDate(i, today.year, {
                month: "short",
                year: "numeric"
              })}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {searchResults.map(({ name, sum, count, grouped }, idx) => {
          return (
            <tr key={idx}>
              <td className={style.removeBtn}>
                <button onClick={() => removeSearch(name)}>X</button>
              </td>
              <td className={style.name}>{name}</td>
              <td className={style.sum}>{currency(sum)}</td>
              <td className={style.count}>{count}</td>
              {range(today.month + 1, 0).map(i => (
                <td key={i}>
                  {currency(sumBy(grouped[today.year][i], "amount"))}
                </td>
              ))}
            </tr>
          );
        })}
        <tr>
          <td />
          <td className={style.totalLabel}>Totals</td>
          <td className={style.sum}>{currency(totals.sum)}</td>
          <td className={style.count}>{totals.count}</td>
        </tr>
      </tbody>
    </table>
  );
}

export default TransactionTotals;
