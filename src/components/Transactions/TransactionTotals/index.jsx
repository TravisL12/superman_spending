import React from "react";
import { currency } from "utilities/formatLocales";

function TransactionTotals({ payees }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Sum</th>
          <th>Count</th>
          <th>Average</th>
        </tr>
      </thead>
      <tbody>
        {payees.map(({ name, sum, count }, idx) => {
          return (
            <tr key={idx}>
              <td>{name}</td>
              <td>{currency(sum)}</td>
              <td>{count}</td>
              <td>{currency(sum / count)}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default TransactionTotals;
