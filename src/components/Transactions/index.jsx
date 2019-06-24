import React, { Component } from "react";
import AuthService from "../../middleware/AuthService";
import TransactionImporter from "../TransactionImporter";
import { isEmpty } from "lodash";
import qs from "query-string";
import style from "./Transactions.module.scss";
import Row from "./TransactionRow";

class Transactions extends Component {
  state = {
    transactions: [],
    isLoading: true,
    searchQuery: "",
    searchCollection: []
  };

  componentWillMount() {
    const searchQuery = qs.parse(this.props.history.location.search);
    const page = this.props.match.params.page || 0;

    const query =
      typeof searchQuery.search === "string"
        ? { search: [searchQuery.search] }
        : searchQuery;

    this.fetch({ query, page });
  }

  submitSearch = event => {
    event.preventDefault();
    const searches = this.state.searchCollection;
    searches.push(this.state.searchQuery);
    const searchCollection = { search: searches };

    this.props.history.push({
      search: qs.stringify(searchCollection)
    });
    this.fetch({ query: searchCollection, page: 0 });
  };

  updateSearchQuery = event => {
    this.setState({ searchQuery: event.target.value });
  };

  fetch(params = { page: 0 }) {
    const query = params.query ? `?${qs.stringify(params.query)}` : null;
    AuthService.fetch(`api/transactions/list/${params.page}${query}`).then(
      ({ transactions }) => {
        const search = !isEmpty(params.query) ? params.query.search : [];

        this.setState({
          transactions,
          searchCollection: search,
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
        {/* combine this search stuff into a component with styling */}
        <div className={style.pageInfo}>
          <div className={style.searchContainer}>
            <div>{transactions.length} Rows</div>
            <div className={style.search}>
              <input
                type="text"
                value={this.state.searchQuery}
                onChange={this.updateSearchQuery}
              />
              <button onClick={this.submitSearch}>Search</button>
            </div>
          </div>
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
