import React, { Component } from "react";
import AuthService from "middleware/AuthService";
import {
  createDateRange,
  currency,
  formatDate
} from "utilities/date-format-utils";
import CategoryGraph from "./CategoryGraph";
import CategoryRow from "./CategoryRow";
import style from "./Categories.module.scss";
import Loading from "components/Loading";
import categoryColors from "utilities/categoryColors";
import { shuffle, values, keys } from "lodash";
import qs from "query-string";

const colors = shuffle(categoryColors);
const MONTHS_BACK = 12 * 1.5;

class Categories extends Component {
  state = {
    categories: null,
    isLoading: true,
    checkedCategories: {},
    graphCumulative: false,
    dateRange: null
  };

  componentWillMount() {
    AuthService.fetch(
      `api/categories/compare?${qs.stringify({ monthsBack: MONTHS_BACK })}`
    ).then(({ categories }) => {
      const checkedCategories = keys(categories).reduce((result, id) => {
        result[id] = true;
        return result;
      }, {});

      this.setState({
        categories,
        isLoading: false,
        checkedCategories,
        dateRange: createDateRange(MONTHS_BACK).reverse() // ascending date order (old -> new)
      });
    });
  }

  getTransactionSum = (year, month, id) => {
    const { checkedCategories, categories } = this.state;
    const { Transactions } = categories[id];

    if (
      checkedCategories[id] &&
      Transactions[year] &&
      Transactions[year][month + 1]
    ) {
      return Transactions[year][month + 1].reduce((sum, t) => {
        sum += t.amount;
        return sum;
      }, 0);
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

  calculateCategoryTotal = (month, year) => {
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
    const checkedCategories = keys(this.state.checkedCategories).reduce(
      (result, id) => {
        result[id] = value;
        return result;
      },
      {}
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

  render() {
    const { isLoading, categories, checkedCategories, dateRange } = this.state;

    if (isLoading) return <Loading />;

    return (
      <div className={style.categoryTransactions}>
        <div className={style.graph}>
          <button
            onClick={() => {
              this.setState({ graphCumulative: !this.state.graphCumulative });
            }}
          >
            Toggle Cumulative
          </button>
          <CategoryGraph
            categories={categories}
            colors={colors}
            getMonthSums={this.getMonthSums}
          />
        </div>
        <div className={style.table}>
          <table>
            <thead>
              <tr>
                <th>
                  <button
                    onClick={() => {
                      this.toggleAllCategories(true);
                    }}
                  >
                    On
                  </button>
                  <button
                    onClick={() => {
                      this.toggleAllCategories(false);
                    }}
                  >
                    Off
                  </button>
                </th>
                {dateRange.map(({ month, year }, idx) => {
                  return (
                    <th key={idx}>
                      {formatDate(month, year, {
                        month: "short",
                        year: "numeric"
                      })}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {values(categories).map((category, idx) => {
                return (
                  <CategoryRow
                    checkedCategories={checkedCategories}
                    color={colors[idx]}
                    category={category}
                    getMonthSums={this.getMonthSums}
                    onCheckboxChange={this.handleCategoryCheckboxChange}
                    key={idx}
                  />
                );
              })}
              <tr>
                <td>{/* spacer for name column */}</td>
                {dateRange.map(({ month, year }, idx) => {
                  return (
                    <td className={style.totalCol} key={idx}>
                      {this.calculateCategoryTotal(month, year)}
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default Categories;
