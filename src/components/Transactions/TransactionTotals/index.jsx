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
          <th />
          <th>Name</th>
          <th>Sum</th>
          <th>Count</th>
          <th>Average</th>
        </tr>
      </thead>
      <tbody>
        {searchResults.map(({ name, sum, count }, idx) => {
          return (
            <tr key={idx}>
              <td>
                <button onClick={() => removeSearch(name)}>X</button>
              </td>
              <td>{name}</td>
              <td>{currency(sum)}</td>
              <td>{count}</td>
              <td>{count && currency(sum / count)}</td>
            </tr>
          );
        })}
        <tr>
          <td />
          <td>Totals</td>
          <td>{currency(totals.sum)}</td>
          <td>{totals.count}</td>
        </tr>
      </tbody>
    </table>
  );
}

export default TransactionTotals;
