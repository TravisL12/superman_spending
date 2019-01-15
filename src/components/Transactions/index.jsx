import React, { Component } from "react";
import AuthService from "../../middleware/AuthService";
import qs from "query-string";
import {
  currency,
  formatFullDate,
  titleCase
} from "../../utilities/formatLocales";
import style from "./Transactions.module.scss";

class Transactions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      transactions: [],
      isLoading: true,
      searchTerm: ""
    };
  }

  componentWillMount() {
    const page = this.props.match.params.page || 0;
    this.fetch({ page });
  }

  // LOOKUP NPM QUERY STRING FOR FETCH
  submitSearch = event => {
    event.preventDefault();
    const page = this.props.match.params.page || 0;
    this.fetch({ query: { search: this.state.searchTerm }, page });
  };

  updateSearchTerm = event => {
    this.setState({ searchTerm: event.target.value });
  };

  fetch(params = {}) {
    const query = params.query ? `?${qs.stringify(params.query)}` : "";
    AuthService.fetch(`api/transactions/list/${params.page}${query}`).then(
      ({ transactions }) => {
        this.setState({ transactions, isLoading: false });
      }
    );
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
      "Subcategory"
    ];

    if (isLoading) {
      return <div />;
    }

    return (
      <div className={style.transactionsList}>
        <div className={style.pageInfo}>
          <div className={style.search}>
            <input
              type="text"
              value={this.state.searchTerm}
              onChange={this.updateSearchTerm}
            />
            <button onClick={this.submitSearch}>Search</button>
          </div>
          <div>{transactions.length} Rows</div>
        </div>

        <table className={style.transactionTable}>
          <thead>
            <tr>
              {headers.map(header => {
                return (
                  <th className={style[`column${header}`]} key={header}>
                    {header}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {transactions.map((t, idx) => {
              return (
                <tr key={idx}>
                  <td>
                    {titleCase(t["payee"]) || this.cleanDesc(t["description"])}
                  </td>
                  <td className={style.columnAmount}>
                    {currency(t["amount"])}
                  </td>
                  <td>{formatFullDate(new Date(t["date"]))}</td>
                  <td>{t["Category"].name}</td>
                  <td>{t["Subcategory"].name}</td>
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
