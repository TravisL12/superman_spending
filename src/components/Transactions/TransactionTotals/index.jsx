import React from "react";
import { isEmpty, sumBy } from "lodash";
import style from "components/Transactions/TransactionsInputs.module.scss";
import {
  createDateRange,
  formatDate,
  currency
} from "utilities/date-format-utils";
import Loading from "components/Loading";
import { CategoriesConsumer } from "providers/CategoriesProvider";
import { qsToArray } from "utilities/query-string-utils";

function TransactionTotals({
  searchResults = [],
  removeSearch,
  currentSearches,
  removeCategorySearch
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

  const viewDates = createDateRange(10);

  return (
    <CategoriesConsumer>
      {({ categories, fetchCategories }) => {
        if (!categories) {
          fetchCategories();
          return <Loading />;
        }

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
                    <button onClick={() => removeSearch("beforeDate")}>
                      X
                    </button>
                    Before: {beforeDate}
                  </li>
                )}
                {qsToArray(categoryIds).map((id, idx) => {
                  const category = categories.find(cat => cat.id === +id);

                  return (
                    <li key={idx}>
                      <button onClick={() => removeCategorySearch(id)}>
                        X
                      </button>
                      {category.name}
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
                  {/* Total Row */}
                  <tr>
                    <td />
                    <td className={style.totalLabel}>Totals</td>
                    <td className={style.sum}>{currency(totals.sum)}</td>
                    <td className={style.count}>{totals.count}</td>
                    {searchResults.length > 1 &&
                      viewDates.map(({ year, month }, idx) => {
                        const total = searchResults.reduce((sum, search) => {
                          sum += search.grouped[year]
                            ? sumBy(search.grouped[year][month + 1], "amount")
                            : 0;
                          return sum;
                        }, 0);
                        return <td key={idx}>{currency(total)}</td>;
                      })}
                  </tr>
                </tbody>
              </table>
            )}
          </>
        );
      }}
    </CategoriesConsumer>
  );
}

export default TransactionTotals;
