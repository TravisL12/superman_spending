import React from "react";
import { currency } from "utilities/date-format-utils";
import style from "./Categories.module.scss";

function CategoryRow({
  category: { id, name },
  checkedCategories,
  color,
  onCheckboxChange,
  getMonthSums
}) {
  const checkBoxStyling = checkedCategories[id]
    ? { background: color, color: "black" }
    : { background: "lightgray", color: "gray" };

  return (
    <tr>
      <td>
        <input
          type="checkbox"
          id={`category-${id}`}
          value={id}
          checked={checkedCategories[id]}
          onChange={onCheckboxChange}
        />
        <label htmlFor={`category-${id}`} style={checkBoxStyling}>
          {name}
        </label>
      </td>
      {getMonthSums(id).map((sum, sIdx) => {
        return (
          <td className={style.amountCol} key={`cat-${sIdx}`}>
            {currency(sum, {
              rounded: true,
              minimumFractionDigits: 0
            })}
          </td>
        );
      })}
    </tr>
  );
}

export default CategoryRow;
