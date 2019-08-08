import React from "react";
import style from "./Categories.module.scss";
import { formatDate } from "utilities/date-format-utils";
import CategoryRow from "./CategoryRow";

function CategorySearch({
  colors,
  dateRange,
  summedCategories,
  checkedRows,
  handleCategoryCheckboxChange,
  toggleAllCategories,
  getCategorySums
}) {
  return (
    <div className={style.table}>
      <table>
        <thead>
          <tr>
            <th className={style.categoryColumn}>
              <button
                onClick={() => {
                  toggleAllCategories(true);
                }}
              >
                On
              </button>
              <button
                onClick={() => {
                  toggleAllCategories(false);
                }}
              >
                Off
              </button>
            </th>
            {dateRange.map(({ month, year }, idx) => {
              return (
                <th key={idx}>
                  {formatDate(month, year, {
                    month: "short",
                    year: "numeric"
                  })}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {summedCategories.map((category, idx) => {
            return (
              <CategoryRow
                checked={checkedRows[category.id]}
                color={colors[idx]}
                category={category}
                onCheckboxChange={handleCategoryCheckboxChange}
                key={idx}
              />
            );
          })}
          <tr>
            <td>{/* spacer for name column */}</td>
            {dateRange.map(({ month, year }, idx) => {
              return (
                <td className={style.totalCol} key={idx}>
                  {getCategorySums(month, year)}
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default CategorySearch;
