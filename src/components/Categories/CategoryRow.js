import React from "react";
import { currency } from "utilities/date-format-utils";
import style from "./Categories.module.scss";

function CategoryRow({
  category: { id, name, sum },
  checked,
  color,
  onCheckboxChange
}) {
  const checkBoxStyling = checked
    ? { background: color, color: "black" }
    : { background: "lightgray", color: "gray" };

  return (
    <tr>
      <td className={style.categoryColumn}>
        <input
          type="checkbox"
          id={`category-${id}`}
          value={id}
          checked={checked}
          onChange={onCheckboxChange}
        />
        <label htmlFor={`category-${id}`} style={checkBoxStyling}>
          {name}
        </label>
      </td>
      {sum.map((s, sIdx) => {
        return (
          <td className={style.amountCol} key={`cat-${sIdx}`}>
            {currency(s, {
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
