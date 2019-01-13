import React, { Component } from "react";
import AuthService from "../../middleware/AuthService";
import { currency, formatFullDate } from "../../utilities/formatLocales";
import style from "./Transactions.module.scss";

class Transactions extends Component {
  constructor() {
    super();
    this.state = {
      transactions: [],
      isLoading: true
    };
  }

  componentWillMount() {
    AuthService.fetch("api/transactions").then(({ transactions }) => {
      this.setState({ transactions, isLoading: false });
    });
  }

  cleanDesc(description) {
    const desc = description
      .replace(/\w{14,}.+/, "")
      .replace(/^Purchase authorized on /i, "");

    return desc;
  }

  render() {
    const { transactions, isLoading } = this.state;
    const headers = [
      "Description",
      "Amount",
      "Date",
      "Category",
      "Subcategory",
      "Payee"
    ];

    if (isLoading) {
      return <div />;
    }

    return (
      <div className={style.transactionsList}>
        <table className={style.transactionTable}>
          <thead>
            <tr>
              {headers.map(header => {
                return <th key={header}>{header}</th>;
              })}
            </tr>
          </thead>
          <tbody>
            {transactions.map((t, idx) => {
              return (
                <tr key={idx}>
                  <td>{this.cleanDesc(t["description"])}</td>
                  <td>{currency(t["amount"])}</td>
                  <td>{formatFullDate(new Date(t["date"]))}</td>
                  <td>{t["category_id"]}</td>
                  <td>{t["subcategory_id"]}</td>
                  <td>{t["payee"]}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Transactions;
