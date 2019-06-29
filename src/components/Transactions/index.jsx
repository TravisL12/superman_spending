import React, { Component } from "react";
import { isEmpty } from "lodash";
import qs from "query-string";

import AuthService from "middleware/AuthService";
import Loading from "components/Loading";
import Search from "./TransactionSearch";
import Totals from "./TransactionTotals";
import Row from "./TransactionRow";
import style from "./Transactions.module.scss";

class Transactions extends Component {
  state = {
    currentSearches: [],
    isLoading: true,
    searchQuery: "",
    searchResults: [],
    transactions: []
  };

  componentWillMount() {
    const searchQuery = qs.parse(this.props.history.location.search);
    const page = this.props.match.params.page || 0;

    const searches =
      typeof searchQuery.search === "string"
        ? [searchQuery.search]
        : searchQuery.search;

    this.fetch(searches, { page });
  }

  removeSearch = value => {
    const searches = this.state.currentSearches;
    const idx = searches.indexOf(value);
    searches.splice(idx, 1);

    this.fetch(searches);
  };

  submitSearch = event => {
    event.preventDefault();
    const { currentSearches, searchQuery } = this.state;

    if (currentSearches.includes(searchQuery)) {
      return;
    }

    const searches = currentSearches;
    searches.push(searchQuery);
    this.fetch(searches);
  };

  updateSearchString = ({ target: { value } }) => {
    this.setState({ searchQuery: value });
  };

  updateLocation = () => {
    this.props.history.push({
      search: qs.stringify({ search: this.state.currentSearches })
    });
  };

  fetch = (searches = [], params = { page: 0 }) => {
    const query = !isEmpty(searches)
      ? `?${qs.stringify({ search: searches })}`
      : "";

    AuthService.fetch(`api/transactions/list/${params.page}${query}`).then(
      ({ transactions, searchResults }) => {
        this.setState(
          {
            currentSearches: searches,
            isLoading: false,
            searchQuery: "",
            searchResults,
            transactions
          },
          this.updateLocation
        );
      }
    );
  };

  render() {
    const { isLoading, searchQuery, searchResults, transactions } = this.state;

    if (isLoading) return <Loading />;

    return (
      <div className={style.transactionsList}>
        <div className={style.searchImport}>
          <Search
            transactions={transactions}
            searchQuery={searchQuery}
            updateSearch={this.updateSearchString}
            submitSearch={this.submitSearch}
          />
        </div>
        <div className={style.searchTotals}>
          {!isEmpty(searchResults) && (
            <Totals
              removeSearch={this.removeSearch}
              searchResults={searchResults}
            />
          )}
        </div>

        <table className={style.transactionTable}>
          <thead>
            <tr>
              <th />
              <th>Description</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Category</th>
              <th>Subcategory</th>
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
