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

const TransactionRow = memo(({ transaction, onCheckboxChange, isChecked }) => {
  const cat = isChecked ? (
    <CategoryDropdown
      onChange={() => {}}
      selectedCategory={transaction.Category}
    />
  ) : (
    transaction.Category.name
  );

  return (
    <tr>
      <td className={style.checkBox}>
        <input
          id={transaction.id}
          type="checkbox"
          value={transaction.id}
          onChange={onCheckboxChange}
        />
        <label htmlFor={transaction.id} />
      </td>
      <td className={style.descriptionCol}>
        {displayPayeeDescription(transaction)}
      </td>
      <td className={style.amountCol}>{currency(transaction.amount)}</td>
      <td>{formatFullDate(new Date(transaction.date))}</td>
      <td className={style.categoryCol}>{cat}</td>
      <td className={style.categoryCol}>{transaction.Subcategory.name}</td>
    </tr>
  );
});

export default TransactionRow;
