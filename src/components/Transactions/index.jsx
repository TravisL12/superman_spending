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
      keywordSearches: undefined,
      beforeDate: undefined,
      afterDate: undefined,
      categoryIds: undefined
    },
    isLoading: true,
    searchInput: {
      keyword: "",
      beforeDate: "",
      afterDate: "",
      categoryIds: ""
    },
    searchResults: [],
    transactions: [],
    checkedIds: []
  };

  componentWillMount() {
    const query = qs.parse(this.props.history.location.search);
    const page = this.props.match.params.page || 0;

    this.fetch(query, { page });
  }

  removeSearch = keyword => {
    if (["afterDate", "beforeDate"].includes(keyword)) {
      this.fetch({
        ...this.state.searchQueries,
        [keyword]: undefined
      });

      return;
    }
    const { searchQueries } = this.state;
    const keywordSearches = searchQueries.keywordSearches.filter(
      search => search !== keyword
    );

    this.fetch({
      ...this.state.searchQueries,
      keywordSearches
    });
  };

  submitSearch = event => {
    event.preventDefault();
    const searchQueries = qs.parse(this.props.history.location.search);
    const {
      searchInput: {
        keyword: keywordInput,
        beforeDate,
        afterDate,
        categoryIds: categoryInput
      }
    } = this.state;

    const request = { ...this.state.searchQueries };

    const searches = Array.isArray(searchQueries.keywordSearches)
      ? [...searchQueries.keywordSearches]
      : !isEmpty(searchQueries.keywordSearches)
        ? [searchQueries.keywordSearches]
        : [];

    if (keywordInput && !searches.includes(keywordInput)) {
      searches.push(keywordInput);
      request.keywordSearches = searches;
    }

    const categories = Array.isArray(searchQueries.categoryIds)
      ? [...searchQueries.categoryIds]
      : !isEmpty(searchQueries.categoryIds)
        ? [searchQueries.categoryIds]
        : [];

    if (categoryInput && !categories.includes(categoryInput)) {
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
    this.fetch();
  };

  updateCheckedRow = ({ target: { value } }) => {
    this.setState(oldState => {
      if (oldState.checkedIds.includes(value)) {
        return { checkedIds: oldState.checkedIds.filter(id => id !== value) };
      } else {
        return { checkedIds: [...oldState.checkedIds, value] };
      }
    });
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
    if (queryKeys.length === 0) {
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
              categoryIds: ""
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
    const {
      isLoading,
      searchInput,
      searchResults,
      transactions,
      searchQueries
    } = this.state;

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
            removeSearch={this.removeSearch}
            searchResults={searchResults}
            currentSearches={searchQueries}
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
              return (
                <Row
                  key={idx}
                  onCheckboxChange={this.updateCheckedRow}
                  transaction={transaction}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Transactions;
