import React, { Component } from "react";
import AuthService from "middleware/AuthService";
import { currency, formatDate } from "utilities/date-format-utils";
import style from "./Categories.module.scss";
import Loading from "components/Loading";
import categoryColors from "utilities/categoryColors";
import { shuffle, values, keys } from "lodash";
import {
  VictoryLabel,
  VictoryAxis,
  VictoryChart,
  VictoryStack,
  VictoryLine,
  VictoryArea
} from "victory";

const colors = shuffle(categoryColors);

class Categories extends Component {
  state = {
    categories: null,
    categoryIds: null,
    isLoading: true,
    checkedCategories: {},
    graphCumulative: false,
    graphType: "stack"
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
    return data.Transactions.reduce((sum, t) => {
      sum += t.amount;
      return sum;
    }, 0);
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
      return this.createRowData(categories, id).map(({ x, y }) => {
        return { x, y: y / 100 };
      });
    });

    const graphHeight = 150;
    const axisColor = "black";
    const axisFontSize = 6;

    const stackChart = (
      <VictoryStack colorScale={colors}>
        {data.map((d, idx) => {
          return <VictoryArea data={d} key={idx} />;
        })}
      </VictoryStack>
    );

    const lineChart = data.map((d, idx) => {
      return (
        <VictoryLine
          data={d}
          key={idx}
          style={{
            data: { stroke: colors[idx] }
          }}
        />
      );
    });

    return (
      <VictoryChart
        animate={{ duration: 500 }}
        padding={{ top: 10, bottom: 10, left: 10, right: 10 }}
        height={graphHeight}
      >
        {this.state.graphType === "stack" ? stackChart : lineChart}

        {/* X-axis */}
        <VictoryAxis
          style={{ tickLabels: { fontSize: axisFontSize } }}
          tickCount={categories.length}
        />

        {/* Y-axis */}
        <VictoryAxis
          dependentAxis
          tickFormat={t => `$${t.toLocaleString()}`}
          tickLabelComponent={<VictoryLabel dx={35} dy={-5} />}
          style={{
            axis: { stroke: 0 },
            tickLabels: {
              fill: axisColor,
              fontSize: axisFontSize,
              fontWeight: 600
            },
            grid: {
              strokeDasharray: "15, 5",
              stroke: axisColor
            }
          }}
        />
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
        <div className={style.graph}>
          <button
            onClick={() => {
              this.setState({ graphCumulative: !this.state.graphCumulative });
            }}
          >
            Toggle Cumulative
          </button>
          <button
            onClick={() => {
              this.setState({ graphType: "stack" });
            }}
          >
            Stack Chart
          </button>
          <button
            onClick={() => {
              this.setState({ graphType: "line" });
            }}
          >
            Line Chart
          </button>
          {graph}
        </div>
        <div className={style.table}>
          <table>
            <thead>
              <tr>
                <th>Categories</th>
                {categories.map((c, idx) => {
                  return (
                    <th key={idx}>
                      {formatDate(c.month, c.year, {
                        month: "short",
                        year: "numeric"
                      })}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {keys(categoryIds).map((id, idx) => {
                const checkBoxStyling = checkedCategories[id]
                  ? { background: colors[idx], color: "black" }
                  : { background: "lightgray", color: "gray" };

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
                      <label htmlFor={`category-${id}`} style={checkBoxStyling}>
                        {categoryIds[id].name}
                      </label>
                    </td>
                    {this.createRowData(categories, id).map(({ y }, cidx) => {
                      return (
                        <td className={style.amountCol} key={`cat-${cidx}`}>
                          {currency(y)}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
              <tr>
                <td />
                {categories.map((c, idx) => {
                  return (
                    <td className={style.totalCol} key={idx}>
                      {this.calculateCategoryTotal(c)}
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
