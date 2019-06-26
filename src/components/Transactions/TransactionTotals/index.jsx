import React from "react";
import style from "components/Transactions/TransactionsInputs.module.scss";
import { currency } from "utilities/formatLocales";

function TransactionTotals({ searchResults, removeSearch }) {
  const totals = searchResults.reduce(
    (result, payee) => {
      result.sum += payee.sum;
      result.count += payee.count;
      return result;
    },
    { sum: 0, count: 0 }
  );

  return (
    <table className={style.totalsTable}>
      <thead>
        <tr>
          <th className={style.removeBtn} />
          <th className={style.name}>Name</th>
          <th className={style.sum}>Sum</th>
          <th className={style.count}>Count</th>
          <th className={style.average}>Average</th>
        </tr>
      </thead>
      <tbody>
        {searchResults.map(({ name, sum, count }, idx) => {
          return (
            <tr key={idx}>
              <td className={style.removeBtn}>
                <button onClick={() => removeSearch(name)}>X</button>
              </td>
              <td className={style.name}>{name}</td>
              <td className={style.sum}>{currency(sum)}</td>
              <td className={style.count}>{count}</td>
              <td className={style.average}>
                {count && currency(sum / count)}
              </td>
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
