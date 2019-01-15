import React, { PureComponent } from "react";
import {
  currency,
  formatFullDate,
  titleCase
} from "../../../utilities/formatLocales";
import style from "../Transactions.module.scss";

// Used PureComponent to avoid unneccessary re-rendering of
// each transaction data row. The use of helper functions (currency, titleCase...)
// was causing the rendering of text input updates to be very slow
class TransactionRow extends PureComponent {
  cleanDesc(description) {
    const desc = description
      .replace(/\w{14,}.+/, "")
      .replace(/^Purchase authorized on /i, "");

    return desc;
  }

  render() {
    const { transaction } = this.props;

    return (
      <tr>
        <td>
          {titleCase(transaction.payee) ||
            this.cleanDesc(transaction.description)}
        </td>
        <td className={style.columnAmount}>{currency(transaction.amount)}</td>
        <td>{formatFullDate(new Date(transaction.date))}</td>
        <td>{transaction.Category.name}</td>
        <td>{transaction.Subcategory.name}</td>
      </tr>
    );
  }
}

export default TransactionRow;
