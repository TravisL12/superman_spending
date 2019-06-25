import React, { Component } from "react";
import AuthService from "../../middleware/AuthService";
import TransactionImporter from "./TransactionImporter";
import TransactionSearch from "./TransactionSearch";
import { isEmpty } from "lodash";
import qs from "query-string";
import style from "./Transactions.module.scss";
import Row from "./TransactionRow";

class Transactions extends Component {
  state = {
    transactions: [],
    isLoading: true,
    searchQuery: "",
    currentSearches: []
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

  removeSearch = value => {
    const searches = this.state.currentSearches;
    const idx = searches.indexOf(value);
    searches.splice(idx, 1);

    this.updateQuery(searches);
  };

  submitSearch = event => {
    event.preventDefault();
    const searches = this.state.currentSearches;

    if (searches.includes(this.state.searchQuery)) {
      return;
    }

    searches.push(this.state.searchQuery);
    this.updateQuery(searches);
  };

  updateQuery = searches => {
    this.props.history.push({
      search: qs.stringify({ search: searches })
    });
    this.fetch({ query: { search: searches }, page: 0 });
  };

  updateSearchString = event => {
    this.setState({ searchQuery: event.target.value });
  };

  fetch = (params = { page: 0 }) => {
    const query = params.query ? `?${qs.stringify(params.query)}` : null;
    AuthService.fetch(`api/transactions/list/${params.page}${query}`).then(
      ({ transactions }) => {
        const search = !isEmpty(params.query) ? params.query.search : [];

        this.setState({
          transactions,
          currentSearches: search,
          isLoading: false
        });
      }
    );
  };

  render() {
    const {
      transactions,
      searchQuery,
      currentSearches,
      isLoading
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
          <TransactionSearch
            transactions={transactions}
            searchQuery={searchQuery}
            updateSearch={this.updateSearchString}
            submitSearch={this.submitSearch}
            searches={currentSearches}
            removeSearch={this.removeSearch}
          />
          <TransactionImporter callback={this.fetch} />
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
