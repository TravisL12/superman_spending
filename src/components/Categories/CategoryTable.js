import React from "react";
import style from "./Categories.module.scss";
import { currencyRounded } from "../../utilities/date-format-utils";

function CategoryTable({
  categories,
  handleCategoryCheckboxChange,
  toggleAllCategories,
}) {
  return (
    <div className={style.table}>
      <table>
        <thead>
          <tr>
            <th className={style.categoryColumn}>
              <button onClick={() => toggleAllCategories(true)}>On</button>
              <button onClick={() => toggleAllCategories(false)}>Off</button>
            </th>
          </tr>
        </thead>
        <tbody>
          {categories.map(({ id, name, total, color, checked }, idx) => {
            return (
              <tr key={idx}>
                <td className={style.categoryColumn}>
                  <input
                    type="checkbox"
                    id={`category-${id}`}
                    value={id}
                    checked={checked}
                    onChange={handleCategoryCheckboxChange}
                  />
                  <label
                    htmlFor={`category-${id}`}
                    style={checked ? { background: color } : {}}
                  >
                    {name}
                  </label>
                </td>

                <td className={style.amountCol}>{currencyRounded(total)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default CategoryTable;
