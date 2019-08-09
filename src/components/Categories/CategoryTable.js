import React from "react";
import style from "./Categories.module.scss";
import CategoryRow from "./CategoryRow";

function CategoryTable({
  summedCategories,
  handleCategoryCheckboxChange,
  toggleAllCategories
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
          </tr>
        </thead>
        <tbody>
          {summedCategories.map((category, idx) => {
            return (
              <CategoryRow
                checked={category.checked}
                color={category.color}
                category={category}
                onCheckboxChange={handleCategoryCheckboxChange}
                key={idx}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default CategoryTable;
