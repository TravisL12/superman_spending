import React from "react";
import { currency } from "utilities/date-format-utils";
import style from "./Categories.module.scss";
import { sum } from "lodash";

function CategoryRow({
  category: { id, name, sum: categorySum },
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

      <td className={style.amountCol}>{currency(sum(categorySum))}</td>
    </tr>
  );
}

export default CategoryRow;
