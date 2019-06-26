import React, { Component } from "react";
import { isEmpty } from "lodash";
import qs from "query-string";

import AuthService from "middleware/AuthService";
import Search from "./TransactionSearch";
import Totals from "./TransactionTotals";
import Row from "./TransactionRow";
import style from "./Transactions.module.scss";

class Transactions extends Component {
  state = {
    transactions: [],
    searchResults: [],
    isLoading: true,
    searchQuery: "",
    currentSearches: []
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
            transactions,
            searchResults,
            currentSearches: searches,
            isLoading: false,
            searchQuery: ""
          },
          this.updateLocation
        );
      }
    );
  };

  render() {
    const {
      transactions,
      searchQuery,
      currentSearches,
      isLoading,
      searchResults
    } = this.state;

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
        <div className={style.searchImport}>
          <Search
            transactions={transactions}
            searchQuery={searchQuery}
            updateSearch={this.updateSearchString}
            submitSearch={this.submitSearch}
            searches={currentSearches}
            removeSearch={this.removeSearch}
          />
        </div>
        <div className={style.searchTotals}>
          {!isEmpty(searchResults) && <Totals searchResults={searchResults} />}
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
