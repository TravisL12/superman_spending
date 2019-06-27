import React, { PureComponent } from "react";
import {
  currency,
  formatFullDate,
  titleCase,
  cleanDescription
} from "utilities/date-format-utils";
import style from "./TransactionRow.module.scss";

// Used PureComponent to avoid unneccessary re-rendering of
// each transaction data row. The use of helper functions (currency, titleCase...)
// was causing the rendering of text input updates to be very slow
class TransactionRow extends PureComponent {
  displayPayeeDescription({ payee, description }) {
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

  render() {
    const { transaction } = this.props;

    return (
      <tr>
        <td className={style.checkBox}>
          <input id={transaction.id} type="checkbox" />
          <label htmlFor={transaction.id} />
        </td>
        <td className={style.descriptionCol}>
          {this.displayPayeeDescription(transaction)}
        </td>
        <td className={style.amountCol}>{currency(transaction.amount)}</td>
        <td>{formatFullDate(new Date(transaction.date))}</td>
        <td className={style.categoryCol}>{transaction.Category.name}</td>
        <td className={style.categoryCol}>{transaction.Subcategory.name}</td>
      </tr>
    );
  }
}

export default TransactionRow;
