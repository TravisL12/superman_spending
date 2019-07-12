import React, { Component } from "react";
import AuthService from "middleware/AuthService";
import { currency } from "utilities/date-format-utils";
import style from "./Categories.module.scss";
import Loading from "components/Loading";
import { values, keys } from "lodash";
import { VictoryTheme, VictoryChart, VictoryStack, VictoryArea } from "victory";

class Categories extends Component {
  state = {
    categories: null,
    categoryIds: null,
    isLoading: true,
    checkedCategories: {},
    graphCumulative: false
  };

  componentWillMount() {
    AuthService.fetch("api/categories/compare").then(
      ({ categories, category_ids }) => {
        const checkedCategories = keys(category_ids).reduce((result, id) => {
          result[id] = true;
          return result;
        }, {});
        this.setState({
          categories,
          categoryIds: category_ids,
          isLoading: false,
          checkedCategories
        });
      }
    );
  }

  sumTransactions = data => {
    return (
      data.Transactions.reduce((sum, t) => {
        sum += t.amount;
        return sum;
      }, 0) / 100
    );
  };

  calculateCategoryTotal = category => {
    const total = values(category.categoryData).reduce((sum, c) => {
      if (this.state.checkedCategories[c.id]) {
        sum += this.sumTransactions(c);
      }

      return sum;
    }, 0);

    return currency(total, {
      minimumFractionDigits: 0,
      rounded: true
    });
  };

  createRowData = (categories, id) => {
    return categories.reduce((result, cat, idx) => {
      let sum =
        this.state.graphCumulative && idx > 0 ? result.slice(-1)[0].y : 0;
      if (this.state.checkedCategories[id]) {
        const data = cat.categoryData[id];
        sum = data ? sum + this.sumTransactions(data) : sum;
      }

      result.push({ x: idx, y: sum });
      return result;
    }, []);
  };

  buildGraph = (categories, categoryIds) => {
    const data = keys(categoryIds).map((id, idx) => {
      return this.createRowData(categories, id);
    });

    return (
      <VictoryChart
        animate={{ duration: 500 }}
        padding={{ top: 0, bottom: 0, left: 50, right: 0 }}
        height={250}
        theme={VictoryTheme.material}
      >
        <VictoryStack>
          {data.map((d, idx) => {
            return <VictoryArea data={d} key={idx} interpolation={"basis"} />;
          })}
        </VictoryStack>
      </VictoryChart>
    );
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
    const {
      isLoading,
      categories,
      categoryIds,
      checkedCategories
    } = this.state;

    if (isLoading) return <Loading />;

    const graph = this.buildGraph(categories, categoryIds);

    return (
      <div className={style.categoryTransactions}>
        <div className={style.table}>
          <table>
            <thead>
              <tr>
                <th />
                <th>Categories</th>
              </tr>
            </thead>
            <tbody>
              {keys(categoryIds).map((id, idx) => {
                return (
                  <tr key={`name-${idx}`}>
                    <td>
                      <input
                        type="checkbox"
                        id={`category-${id}`}
                        value={id}
                        checked={checkedCategories[id]}
                        onChange={this.handleCategoryCheckboxChange}
                      />
                      <label htmlFor={`category-${id}`} />
                    </td>
                    <td className={style.categoryCol}>
                      {categoryIds[id].name}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className={style.graph}>
          <button
            onClick={() => {
              this.setState({ graphCumulative: !this.state.graphCumulative });
            }}
          >
            Toggle Cumulative
          </button>
          {graph}
        </div>
      </div>
    );
  }
}

export default Categories;
