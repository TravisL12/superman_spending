import React, { Component } from "react";
import { isEqual, isEmpty } from "lodash";
import qs from "query-string";

import AuthService from "../../middleware/AuthService";
import Loading from "../Loading";
import Search from "./TransactionSearch";
import Totals from "./TransactionTotals";
import Table from "./TransactionTable";
import style from "./Transactions.module.scss";
import { qsToArray, filterOutValue } from "../../utilities/query-string-utils";

class Transactions extends Component {
  state = {
    searchQueries: {
      keywordSearches: undefined,
      beforeDate: undefined,
      afterDate: undefined,
      categoryIds: undefined,
    },
    isLoading: true,
    searchInput: {
      keyword: "",
      beforeDate: "",
      afterDate: "",
      categoryIds: "",
    },
    searchResults: [],
    transactions: [],
    checkedIds: [],
  };

  componentWillMount() {
    const query = qs.parse(this.props.history.location.search);
    const page = this.props.match.params.page || 0;

    this.fetch(query, { page });
  }

  removeCategorySearch = (removeId) => {
    const categoryIds = this.state.searchQueries.categoryIds.filter((id) => {
      return id !== removeId;
    });

    this.fetch({
      ...this.state.searchQueries,
      categoryIds,
    });
  };

  removeSearch = (keyword) => {
    if (["afterDate", "beforeDate"].includes(keyword)) {
      this.fetch({
        ...this.state.searchQueries,
        [keyword]: undefined,
      });

      return;
    }
    const { searchQueries } = this.state;
    const keywordSearches = filterOutValue(
      searchQueries.keywordSearches,
      keyword
    );

    this.fetch({
      ...this.state.searchQueries,
      keywordSearches,
    });
  };

  submitSearch = (event) => {
    event.preventDefault();
    const searchQueries = qs.parse(this.props.history.location.search);
    const {
      searchInput: {
        keyword: keywordInput,
        beforeDate,
        afterDate,
        categoryIds: categoryInput,
      },
    } = this.state;

    const request = { ...searchQueries };

    const searches = qsToArray(searchQueries.keywordSearches);
    if (keywordInput && !searches.includes(keywordInput)) {
      searches.push(keywordInput);
      request.keywordSearches = searches;
    }

    if (categoryInput) {
      request.categoryIds = categoryInput;
    }

    if (beforeDate) {
      request.beforeDate = beforeDate;
    }

    if (afterDate) {
      request.afterDate = afterDate;
    }

    if (isEqual(request, searchQueries)) {
      return;
    }

    this.fetch(request);
  };

  resetSearch = () => {
    this.fetch();
  };

  updateCategory = ({ target }) => {
    const path = target.transactionId ? `/${target.transactionId}` : "";
    const body = target.transactionId
      ? { category_id: target.value }
      : { id: this.state.checkedIds, category_id: target.value };

    AuthService.fetch(`api/categories/update${path}`, {
      method: "POST",
      body: JSON.stringify(body),
    }).then(() => {
      this.setState({ checkedIds: [] }, () => {
        this.fetch(this.state.searchQueries);
      });
    });
  };

  updateCheckedRow = ({ target: { value } }) => {
    this.setState((oldState) => {
      return oldState.checkedIds.includes(value)
        ? { checkedIds: oldState.checkedIds.filter((id) => id !== value) }
        : { checkedIds: [...oldState.checkedIds, value] };
    });
  };

  onSearchChange = ({ target }) => {
    this.setState((oldState) => {
      const searchInput = {
        ...oldState.searchInput,
        [target.name]: target.value,
      };

      return { searchInput };
    });
  };

  fetch = (searchQueries = {}, params = { page: 0 }) => {
    const query = !isEmpty(searchQueries) ? qs.stringify(searchQueries) : "";

    AuthService.fetch(`api/transactions/list/${params.page}?${query}`).then(
      ({ transactions, searchResults }) => {
        this.setState(
          {
            searchQueries,
            isLoading: false,
            searchInput: {
              keyword: "",
              beforeDate: "",
              afterDate: "",
              categoryIds: searchQueries.categoryIds || [],
            },
            searchResults,
            transactions,
          },
          this.updateLocation
        );
      }
    );
  };

  updateLocation = () => {
    this.props.history.push({
      search: qs.stringify(this.state.searchQueries),
    });
  };

  render() {
    const {
      isLoading,
      searchInput,
      searchResults,
      transactions,
      searchQueries,
      checkedIds,
    } = this.state;

    if (isLoading) return <Loading />;

    return (
      <div className={style.transactionsList}>
        <div className={style.searchImport}>
          <Search
            transactions={transactions}
            searchInput={searchInput}
            searchQueries={searchQueries}
            onSearchChange={this.onSearchChange}
            submitSearch={this.submitSearch}
            resetSearch={this.resetSearch}
          />
        </div>
        <div className={style.searchTotals}>
          <Totals
            removeSearch={this.removeSearch}
            removeCategorySearch={this.removeCategorySearch}
            searchResults={searchResults}
            currentSearches={searchQueries}
          />
        </div>

        <Table
          checkedIds={checkedIds}
          transactions={transactions}
          updateCheckedRow={this.updateCheckedRow}
          updateCategory={this.updateCategory}
        />
      </div>
    );
  }
}

export default Transactions;
