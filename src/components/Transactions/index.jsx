import React, { Component } from "react";
import { isEqual, isEmpty } from "lodash";
import qs from "query-string";

import AuthService from "middleware/AuthService";
import Loading from "components/Loading";
import Search from "./TransactionSearch";
import Totals from "./TransactionTotals";
import Row from "./TransactionRow";
import style from "./Transactions.module.scss";

class Transactions extends Component {
  state = {
    searchQueries: { keywordSearches: [], date: undefined },
    isLoading: true,
    searchInput: {
      keyword: "",
      date: ""
    },
    searchResults: [],
    transactions: []
  };

  componentWillMount() {
    const query = qs.parse(this.props.history.location.search);
    const page = this.props.match.params.page || 0;

    const keywordSearches = !query.keywordSearches
      ? []
      : typeof query.keywordSearches === "string"
        ? [query.keywordSearches]
        : query.keywordSearches;

    const searchQueries = { ...query, keywordSearches };

    this.fetch(searchQueries, { page });
  }

  removeKeyword = keyword => {
    const {
      searchQueries: { keywordSearches }
    } = this.state;
    const idx = keywordSearches.indexOf(keyword);
    keywordSearches.splice(idx, 1);

    this.fetch({ ...this.state.searchQueries, keywordSearches });
  };

  submitSearch = event => {
    event.preventDefault();
    const {
      searchQueries: { keywordSearches },
      searchInput: { keyword: keywordInput, date }
    } = this.state;

    const request = { ...this.state.searchQueries };

    const searches = [...keywordSearches];
    if (keywordInput && !keywordSearches.includes(keywordInput)) {
      searches.push(keywordInput);
      request.keywordSearches = searches;
    }

    if (date) {
      request.date = date;
    }

    if (isEqual(request, this.state.searchQueries)) {
      return;
    }

    this.fetch(request);
  };

  updateSearchString = ({ target }) => {
    this.setState(oldState => {
      const searchInput = {
        ...oldState.searchInput,
        [target.name]: target.value
      };

      return { searchInput };
    });
  };

  updateLocation = () => {
    this.props.history.push({
      search: qs.stringify(this.state.searchQueries)
    });
  };

  fetch = (searchQueries = {}, params = { page: 0 }) => {
    const query = !isEmpty(searchQueries)
      ? `?${qs.stringify(searchQueries)}`
      : "";

    AuthService.fetch(`api/transactions/list/${params.page}${query}`).then(
      ({ transactions, searchResults }) => {
        this.setState(
          {
            searchQueries,
            isLoading: false,
            searchInput: {
              keyword: "",
              date: ""
            },
            searchResults,
            transactions
          },
          this.updateLocation
        );
      }
    );
  };

  render() {
    const { isLoading, searchInput, searchResults, transactions } = this.state;

    if (isLoading) return <Loading />;

    return (
      <div className={style.transactionsList}>
        <div className={style.searchImport}>
          <Search
            transactions={transactions}
            searchInput={searchInput}
            updateSearch={this.updateSearchString}
            submitSearch={this.submitSearch}
          />
        </div>
        <div className={style.searchTotals}>
          {!isEmpty(searchResults) && (
            <Totals
              removeKeyword={this.removeKeyword}
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
