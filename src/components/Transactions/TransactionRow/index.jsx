import React, { PureComponent } from "react";
import {
  currency,
  formatFullDate,
  titleCase
} from "../../../utilities/formatLocales";
import style from "./TransactionRow.module.scss";

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

  displayPayeeDescription({ payee, description }) {
    const cleanDesc = this.cleanDesc(description);

    if (!payee) {
      return cleanDesc;
    }

    return (
      <ul>
        <li className={style.payee}>{titleCase(payee)}</li>
        <li className={style.description}>{cleanDesc}</li>
      </ul>
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
