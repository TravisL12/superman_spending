import React, { Component } from "react";
import AuthService from "middleware/AuthService";
import { createDateRange, currency } from "utilities/date-format-utils";
import CategoryGraph from "./CategoryGraph";
import CategorySearch from "./CategorySearch";
import CategoryTable from "./CategoryTable";
import style from "./Categories.module.scss";
import Loading from "components/Loading";
import categoryColors from "utilities/categoryColors";
import { shuffle, values, keys } from "lodash";
import qs from "query-string";

const colors = shuffle(categoryColors);
const MONTHS_BACK = 12 * 2;

class Categories extends Component {
  state = {
    searches: null,
    categories: null,
    isLoading: true,
    checkedRows: {},
    graphCumulative: false,
    dateRange: null
  };

  async componentWillMount() {
    const data = await AuthService.fetch(
      `api/categories/compare?${qs.stringify({ monthsBack: MONTHS_BACK })}`
    );

    const { categories } = data;
    const checkedRows = keys(categories).reduce((result, id) => {
      result[id] = true;
      return result;
    }, {});

    this.setState({
      categories,
      isLoading: false,
      checkedRows,
      dateRange: createDateRange(MONTHS_BACK).reverse() // ascending date order (old -> new)
    });
  }

  getTransactionSum = (year, month, id) => {
    const { checkedRows, categories } = this.state;
    const { transactionTotals } = categories[id];

    if (
      checkedRows[id] &&
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

  getCategorySums = (month, year) => {
    const { categories } = this.state;

    const total = values(categories).reduce((sum, { id }) => {
      return sum + this.getTransactionSum(year, month, id);
    }, 0);

    return currency(total, {
      minimumFractionDigits: 0,
      rounded: true
    });
  };

  toggleAllCategories = value => {
    const checkedRows = keys(this.state.checkedRows).reduce((result, id) => {
      result[id] = value;
      return result;
    }, {});

    this.setState({ checkedRows });
  };

  handleCategoryCheckboxChange = event => {
    const { target } = event;
    const checkboxVal = this.state.checkedRows[target.value];
    const checkedRows = this.state.checkedRows;
    checkedRows[target.value] = !checkboxVal;

    this.setState({
      checkedRows
    });
  };

  toggleCumulative = () => {
    this.setState({ graphCumulative: !this.state.graphCumulative });
  };

  getSearchResults = searchResults => {
    const checkResultRows = keys(searchResults).reduce((result, row) => {
      result[row] = true;
      return result;
    }, {});

    this.setState({
      checkedRows: { ...checkResultRows, ...this.state.checkedRows },
      categories: { ...searchResults, ...this.state.categories }
    });
  };

  render() {
    const { isLoading, categories, checkedRows, dateRange } = this.state;

    if (isLoading) return <Loading />;

    const summedCategories = values(categories).map(({ id, name }, idx) => {
      return { id, name, sum: this.getMonthSums(id) };
    });

    return (
      <div className={style.categoryTransactions}>
        <CategoryGraph
          data={summedCategories}
          dateRange={dateRange}
          colors={colors}
          toggleCumulative={this.toggleCumulative}
        />
        <CategorySearch getSearchResults={this.getSearchResults} />
        <CategoryTable
          checkedRows={checkedRows}
          colors={colors}
          dateRange={dateRange}
          getCategorySums={this.getCategorySums}
          handleCategoryCheckboxChange={this.handleCategoryCheckboxChange}
          summedCategories={summedCategories}
          toggleAllCategories={this.toggleAllCategories}
        />
      </div>
    );
  }
}

export default Categories;
