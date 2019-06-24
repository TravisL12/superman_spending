import React, { Component } from "react";
import AuthService from "../../middleware/AuthService";
import TransactionImporter from "../TransactionImporter";
import qs from "query-string";
import style from "./Transactions.module.scss";
import Row from "./TransactionRow";

class Transactions extends Component {
  state = {
    transactions: [],
    isLoading: true,
    searchQuery: undefined
  };

  componentWillMount() {
    const searchQuery = qs.parse(this.props.history.location.search);
    const page = this.props.match.params.page || 0;
    this.fetch({ query: searchQuery, page });
  }

  submitSearch = event => {
    event.preventDefault();
    const searchQuery = { search: this.state.searchQuery };
    this.props.history.push({
      search: qs.stringify(searchQuery)
    });
    this.fetch({ query: searchQuery, page: 0 });
  };

  updateSearchQuery = event => {
    event.preventDefault();
    this.setState({ searchQuery: event.target.value });
  };

  fetch(params = { page: 0 }) {
    const query = params.query ? `?${qs.stringify(params.query)}` : "";
    AuthService.fetch(`api/transactions/list/${params.page}${query}`).then(
      ({ transactions }) => {
        const { search } = params.query ? params.query : "";
        this.setState({
          transactions,
          searchQuery: search,
          isLoading: false
        });
      }
    );
  }

  render() {
    const { transactions, isLoading } = this.state;
    const headers = [
      "",
      "Description",
      "Amount",
      "Date",
      "Category",
      "Subcategory"
    ];

    if (isLoading) return <div>Loading...</div>;

    return (
      <div className={style.transactionsList}>
        <div className={style.pageInfo}>
          <div className={style.search}>
            <input
              type="text"
              value={this.state.searchQuery}
              onChange={this.updateSearchQuery}
            />
            <button onClick={this.submitSearch}>Search</button>
          </div>
          <div>{transactions.length} Rows</div>
          <div>
            <TransactionImporter callback={this.fetch} />
          </div>
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
              return <Row key={idx} transaction={t} />;
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Transactions;
