import React, { Component } from "react";
import { titleCase, currency } from "utilities/date-format-utils";
import style from "./MonthTotals.module.scss";

class MonthTotals extends Component {
  state = {
    currentColumn: "categories"
  };

  showCategories = () => {
    this.setState({ currentColumn: "categories" });
  };

  showPayees = () => {
    this.setState({ currentColumn: "payees" });
  };

  render() {
    const { categoryData, payeeData } = this.props;
    const { currentColumn } = this.state;

    const categoryTotal = categoryData.reduce((sum, data) => {
      sum += data.sum;
      return sum;
    }, 0);

    const categoryList = (
      <ul>
        {categoryData.map((data, idx) => {
          return (
            <li key={idx}>
              <span className={style.name}>{data.name}</span>
              <span className={style.sum}>
                {currency(data.sum, {
                  minimumFractionDigits: 0,
                  rounded: true
                })}
              </span>
            </li>
          );
        })}
        <li className={style.categoryTotal}>
          <span className={style.name}>Total</span>
          <span className={style.sum}>
            {currency(categoryTotal, {
              minimumFractionDigits: 0,
              rounded: true
            })}
          </span>
        </li>
      </ul>
    );

    const payeeList = (
      <ul>
        {payeeData.map(({ name, count, sum }, idx) => {
          return (
            <li key={idx}>
              <span className={style.name}>
                {titleCase(name)} - {count}
              </span>
              <span className={style.average}>{currency(sum / count)}</span>
              <span className={style.sum}>{currency(sum)}</span>
            </li>
          );
        })}
      </ul>
    );

    const columnList = {
      categories: categoryList,
      payees: payeeList
    };

    return (
      <div className={`${style.totalsContainer} ${style.categories}`}>
        <div className={style.selectColumn}>
          <button onClick={this.showCategories}>Categories</button>
          <button onClick={this.showPayees}>Payees</button>
        </div>
        {columnList[currentColumn]}
      </div>
    );
  }
}

export default MonthTotals;
