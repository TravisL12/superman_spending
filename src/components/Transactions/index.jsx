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
    searchQueries: {
      keywordSearches: [],
      beforeDate: undefined,
      afterDate: undefined,
      categoryIds: []
    },
    isLoading: true,
    searchInput: {
      keyword: "",
      beforeDate: "",
      afterDate: "",
      categoryIds: []
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
      searchQueries: { keywordSearches, categoryIds },
      searchInput: {
        keyword: keywordInput,
        beforeDate,
        afterDate,
        categoryIds: categoryInput
      }
    } = this.state;

    const request = { ...this.state.searchQueries };

    const searches = keywordSearches ? [...keywordSearches] : [];
    if (keywordInput && !searches.includes(keywordInput)) {
      searches.push(keywordInput);
      request.keywordSearches = searches;
    }

    const categories = categoryIds ? [...categoryIds] : [];
    if (!isEmpty(categoryInput) && !categories.includes(categoryInput)) {
      categories.push(categoryInput);
      request.categoryIds = categories;
    }

    if (beforeDate) {
      request.beforeDate = beforeDate;
    }

    if (afterDate) {
      request.afterDate = afterDate;
    }

    if (isEqual(request, this.state.searchQueries)) {
      return;
    }

    this.fetch(request);
  };

  resetSearch = () => {
    this.fetch({ keywordSearches: [] });
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

  // Keyword Searches needs to always be an array
  buildQuery = searchQueries => {
    const queryKeys = Object.keys(searchQueries);
    if (queryKeys.length === 1 && isEmpty(searchQueries.keywordSearches)) {
      return "";
    }

    return `?${qs.stringify(searchQueries)}`;
  };

  fetch = (searchQueries = {}, params = { page: 0 }) => {
    const query = this.buildQuery(searchQueries);

    AuthService.fetch(`api/transactions/list/${params.page}${query}`).then(
      ({ transactions, searchResults }) => {
        this.setState(
          {
            searchQueries,
            isLoading: false,
            searchInput: {
              keyword: "",
              beforeDate: "",
              afterDate: "",
              categoryIds: []
            },
            searchResults,
            transactions
          },
          this.updateLocation
        );
      }
    );
  };

  updateLocation = () => {
    this.props.history.push({
      search: qs.stringify(this.state.searchQueries)
    });
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
            resetSearch={this.resetSearch}
          />
        </div>
        <div className={style.searchTotals}>
          <Totals
            removeKeyword={this.removeKeyword}
            searchResults={searchResults}
          />
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
            {transactions.map((transaction, idx) => {
              return <Row key={idx} transaction={transaction} />;
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Transactions;
