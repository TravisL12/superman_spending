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
import { get, isEmpty, shuffle, values } from "lodash";
import qs from "query-string";

const colors = shuffle(categoryColors);
const MONTHS_BACK = 12 * 2;

const toggleCategories = (value, categories) => {
  return categories.reduce((result, category) => {
    category.checked = value;
    result[category.id] = category;
    return result;
  }, {});
};

class Categories extends Component {
  state = {
    searches: null,
    categories: null,
    isLoading: true,
    graphCumulative: false,
    dateRange: null,
    searchTransactions: []
  };

  async componentWillMount() {
    const data = await AuthService.fetch(
      `api/categories/compare?${qs.stringify({ monthsBack: MONTHS_BACK })}`
    );

    const categories = values(data.categories).reduce((result, category) => {
      category.checked = category.total > MONTHS_BACK * 10000;
      result[category.id] = category;
      return result;
    }, {});

    this.setState({
      categories,
      isLoading: false,
      dateRange: createDateRange(MONTHS_BACK).reverse() // ascending date order (old -> new)
    });
  }

  getMonthSums = categoryId => {
    const { graphCumulative, dateRange, categories } = this.state;
    const { transactionTotals } = categories[categoryId];

    return dateRange.reduce((result, { month, year }, idx) => {
      const monthSum = get(transactionTotals, [year, month], 0);

      const sum =
        graphCumulative && idx > 0 ? monthSum + result.slice(-1)[0] : monthSum;

      return [...result, sum];
    }, []);
  };

  toggleAllCategories = value => {
    const categories = toggleCategories(value, this.state.categories);
    this.setState({ categories });
  };

  handleCategoryCheckboxChange = event => {
    const { target } = event;
    const categories = values(this.state.categories).reduce(
      (result, category) => {
        if (String(target.value) === String(category.id)) {
          category.checked = !category.checked;
        }
        result[category.id] = category;
        return result;
      },
      {}
    );

    this.setState({
      categories
    });
  };

  toggleCumulative = () => {
    this.setState({ graphCumulative: !this.state.graphCumulative });
  };

  getSearchResults = (searchResults, transactions) => {
    const categories = toggleCategories(false, this.state.categories);

    this.setState({
      categories: { ...categories, ...searchResults },
      searchTransactions: [...this.state.transactions, ...transactions].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      )
    });
  };

  render() {
    const { isLoading, categories, dateRange, searchTransactions } = this.state;

    if (isLoading) return <Loading />;

    // Show all categories (checked & unchecked)
    const tableCategories = values(categories).map(
      ({ id, name, total, transactionTotals, checked }, idx) => {
        return {
          id,
          name,
          total,
          transactionTotals,
          checked,
          sum: this.getMonthSums(id),
          color: colors[idx]
        };
      }
    );

    // Only graph the checked categories
    const graphCategories = tableCategories.filter(({ checked }) => checked);

    return (
      <div className={style.categoryTransactions}>
        <div className={style.categoryGraph}>
          <CategoryTable
            handleCategoryCheckboxChange={this.handleCategoryCheckboxChange}
            summedCategories={tableCategories}
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
        {!isEmpty(searchTransactions) && (
          <TransactionTable transactions={searchTransactions} />
        )}
      </div>
    );
  }
}

export default Categories;
