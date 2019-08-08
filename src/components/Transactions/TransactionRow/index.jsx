import React, { memo } from "react";
import {
  currency,
  formatFullDate,
  titleCase,
  cleanDescription
} from "utilities/date-format-utils";
import CategoryDropdown from "components/CategoryInputs/dropdown";
import style from "./TransactionRow.module.scss";

function displayPayeeDescription({ payee, description }) {
  const cleanDesc = cleanDescription(description);

  if (!payee) {
    return cleanDesc;
  }

  return (
    <>
      <div className={style.payee}>{titleCase(payee)}</div>
      <div className={style.description}>{cleanDesc}</div>
    </>
  );
}

const TransactionRow = memo(
  ({ transaction, onCheckboxChange, isChecked, updateCategory }) => {
    const { Category, id, amount, date, Subcategory } = transaction;

    const categoryColumn = isChecked ? (
      <CategoryDropdown
        transactionId={id}
        onChange={updateCategory}
        selectedCategory={Category}
      />
    ) : (
      Category.name
    );

    return (
      <tr>
        <td className={style.checkBox}>
          <input
            id={id}
            type="checkbox"
            value={id}
            checked={isChecked}
            onChange={onCheckboxChange}
          />
          <label htmlFor={id} />
        </td>
        <td className={style.descriptionCol}>
          {displayPayeeDescription(transaction)}
        </td>
        <td className={style.amountCol}>{currency(amount)}</td>
        <td>{formatFullDate(new Date(date))}</td>
        <td className={style.categoryCol}>{categoryColumn}</td>
        <td className={style.categoryCol}>{Subcategory.name}</td>
      </tr>
    );
  }
);

export default TransactionRow;
