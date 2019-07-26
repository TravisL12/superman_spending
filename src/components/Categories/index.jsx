import React, { Component } from "react";
import AuthService from "middleware/AuthService";
import {
  createDateRange,
  currency,
  formatDate
} from "utilities/date-format-utils";
import style from "./Categories.module.scss";
import Loading from "components/Loading";
import categoryColors from "utilities/categoryColors";
import { shuffle, values, keys } from "lodash";
import qs from "query-string";
import {
  VictoryLabel,
  VictoryAxis,
  VictoryChart,
  VictoryStack,
  VictoryLine,
  VictoryArea
} from "victory";

const colors = shuffle(categoryColors);
const MONTHS_BACK = 12 * 1;

class Categories extends Component {
  state = {
    categories: null,
    isLoading: true,
    checkedCategories: {},
    graphCumulative: false,
    graphType: "stack",
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

      result.push(sum);
      return result;
    }, []);
  };

  calculateCategoryTotal = (month, year) => {
    const { categories } = this.state;

    const total = values(categories).reduce((sum, { id, Transactions }) => {
      sum += this.getTransactionSum(year, month, id);

      return sum;
    }, 0);

    return currency(total, {
      minimumFractionDigits: 0,
      rounded: true
    });
  };

  buildGraph = () => {
    const { categories } = this.state;
    const data = values(categories).map(({ id, name, Transactions }, idx) => {
      return this.getMonthSums(id).map((sum, idx) => {
        return { x: idx, y: sum / 100 };
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
    const { isLoading, categories, checkedCategories, dateRange } = this.state;

    if (isLoading) return <Loading />;

    const graph = this.buildGraph();

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
              {values(categories).map(({ id, name, Transactions }, idx) => {
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
                        {name}
                      </label>
                    </td>
                    {this.getMonthSums(id).map((sum, sIdx) => {
                      return (
                        <td className={style.amountCol} key={`cat-${sIdx}`}>
                          {currency(sum, {
                            rounded: true,
                            minimumFractionDigits: 0
                          })}
                        </td>
                      );
                    })}
                  </tr>
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
