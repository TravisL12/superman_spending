import React from "react";
import Row from "./TransactionRow";
import CategoryDropdown from "../CategoryInputs/dropdown";
import style from "./Transactions.module.scss";

function TransactionTable({
  checkedIds,
  transactions,
  updateCheckedRow,
  updateCategory,
}) {
  const categoryColumn =
    checkedIds.length > 1 ? (
      <CategoryDropdown onChange={updateCategory} />
    ) : (
      "Category"
    );

  return (
    <table className={style.transactionTable}>
      <thead>
        <tr>
          <th />
          <th>Description</th>
          <th>Amount</th>
          <th>Date</th>
          <th>{categoryColumn}</th>
          <th>Subcategory</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map((transaction, idx) => {
          return (
            <Row
              key={idx}
              onCheckboxChange={updateCheckedRow}
              transaction={transaction}
              isChecked={checkedIds.includes(String(transaction.id))}
              updateCategory={updateCategory}
            />
          );
        })}
      </tbody>
    </table>
  );
}

TransactionTable.defaultProps = {
  checkedIds: [],
  updateCheckedRow: undefined,
  updateCategory: undefined,
};

export default TransactionTable;
