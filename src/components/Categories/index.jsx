import React, { Component } from "react";
import AuthService from "middleware/AuthService";
import { createDateRange } from "utilities/date-format-utils";
import CategoryGraph from "./CategoryGraph";
import CategorySearch from "./CategorySearch";
import CategoryTable from "./CategoryTable";
import TransactionTable from "components/Transactions/TransactionTable";
import style from "./Categories.module.scss";
import Loading from "components/Loading";
import categoryColors from "utilities/categoryColors";
import { isEmpty, shuffle, values, keys } from "lodash";
import qs from "query-string";

const colors = shuffle(categoryColors);
const MONTHS_BACK = 12 * 2;

const toggleCategories = (value, rows) => {
  return keys(rows).reduce((result, id) => {
    result[id] = value;
    return result;
  }, {});
};

class Categories extends Component {
  state = {
    searches: null,
    categories: null,
    isLoading: true,
    checkedCategories: {},
    graphCumulative: false,
    dateRange: null,
    transactions: []
  };

  async componentWillMount() {
    const data = await AuthService.fetch(
      `api/categories/compare?${qs.stringify({ monthsBack: MONTHS_BACK })}`
    );

    const { categories } = data;
    const checkedCategories = keys(categories).reduce((result, id) => {
      result[id] = categories[id].total > MONTHS_BACK * 10000;
      return result;
    }, {});

    this.setState({
      categories,
      isLoading: false,
      checkedCategories,
      dateRange: createDateRange(MONTHS_BACK).reverse() // ascending date order (old -> new)
    });
  }

  getTransactionSum = (year, month, id) => {
    const { checkedCategories, categories } = this.state;
    const { transactionTotals } = categories[id];

    if (
      checkedCategories[id] &&
      transactionTotals[year] &&
      transactionTotals[year][month]
    ) {
      return transactionTotals[year][month];
    } else {
      return 0;
    }
  };

  getMonthSums = categoryId => {
    const { graphCumulative, dateRange } = this.state;

    return dateRange.reduce((result, { month, year }, idx) => {
      const monthSum = this.getTransactionSum(year, month, categoryId);
      const sum =
        graphCumulative && idx > 0 ? monthSum + result.slice(-1)[0] : monthSum;

      return [...result, sum];
    }, []);
  };

  toggleAllCategories = value => {
    const checkedCategories = toggleCategories(
      value,
      this.state.checkedCategories
    );
    this.setState({ checkedCategories });
  };

  handleCategoryCheckboxChange = event => {
    const { target } = event;
    const checkboxVal = this.state.checkedCategories[target.value];
    const checkedCategories = this.state.checkedCategories;
    checkedCategories[target.value] = !checkboxVal;

    this.setState({
      checkedCategories
    });
  };

  toggleCumulative = () => {
    this.setState({ graphCumulative: !this.state.graphCumulative });
  };

  getSearchResults = (searchResults, transactions) => {
    const checkResultRows = keys(searchResults).reduce((result, row) => {
      result[row] = true;
      return result;
    }, {});
    const checkCategoryRows = toggleCategories(
      false,
      this.state.checkedCategories
    );

    this.setState({
      checkedCategories: { ...checkResultRows, ...checkCategoryRows },
      categories: { ...this.state.categories, ...searchResults },
      transactions: [...this.state.transactions, ...transactions].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      )
    });
  };

  render() {
    const {
      isLoading,
      categories,
      checkedCategories,
      dateRange,
      transactions
    } = this.state;

    if (isLoading) return <Loading />;

    const summedCategories = values(categories).map(({ id, name }, idx) => {
      return { id, name, sum: this.getMonthSums(id), color: colors[idx] };
    });

    const graphCategories = summedCategories.filter(
      ({ id }) => checkedCategories[id]
    );

    return (
      <div className={style.categoryTransactions}>
        <div className={style.categoryGraph}>
          <CategoryTable
            checkedRows={checkedCategories}
            handleCategoryCheckboxChange={this.handleCategoryCheckboxChange}
            summedCategories={summedCategories}
            toggleAllCategories={this.toggleAllCategories}
          />
          <div className={style.graph}>
            <CategoryGraph
              data={graphCategories}
              dateRange={dateRange}
              toggleCumulative={this.toggleCumulative}
            />
          </div>
        </div>
        <CategorySearch
          {...this.props}
          getSearchResults={this.getSearchResults}
        />
        {!isEmpty(transactions) && (
          <TransactionTable transactions={transactions} />
        )}
      </div>
    );
  }
}

export default Categories;
