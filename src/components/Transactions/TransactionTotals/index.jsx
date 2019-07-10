import React from "react";
import { isEmpty, sumBy } from "lodash";
import style from "components/Transactions/TransactionsInputs.module.scss";
import { dateRange, formatDate, currency } from "utilities/date-format-utils";

function TransactionTotals({
  searchResults = [],
  removeSearch,
  currentSearches
}) {
  const totals = searchResults.reduce(
    (result, payee) => {
      result.sum += payee.sum;
      result.count += payee.count;
      return result;
    },
    { sum: 0, count: 0 }
  );

  const { afterDate, beforeDate, categoryIds } = currentSearches;

  const viewDates = dateRange(10);

  return (
    <>
      <div className={style.currentSearches}>
        <ul>
          {afterDate && (
            <li>
              <button onClick={() => removeSearch("afterDate")}>X</button>
              After: {afterDate}
            </li>
          )}
          {beforeDate && (
            <li>
              <button onClick={() => removeSearch("beforeDate")}>X</button>
              Before: {beforeDate}
            </li>
          )}
          {categoryIds &&
            categoryIds.map((id, idx) => {
              return (
                <li key={idx}>
                  <button>X</button> Category {id}
                </li>
              );
            })}
        </ul>
      </div>

      {!isEmpty(searchResults) && (
        <table className={style.totalsTable}>
          <thead>
            <tr>
              <th className={style.removeBtn} />
              <th className={style.name}>Name</th>
              <th className={style.sum}>Sum</th>
              <th className={style.count}>Count</th>
              {viewDates.map(({ year, month }, idx) => (
                <th key={idx}>
                  {formatDate(month, year, {
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
                  {viewDates.map(({ year, month }, idx) => (
                    <td key={idx}>
                      {currency(
                        grouped[year]
                          ? sumBy(grouped[year][month + 1], "amount")
                          : 0
                      )}
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
      )}
    </>
  );
}

export default TransactionTotals;
