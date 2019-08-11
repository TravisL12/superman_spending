import React, { Component } from "react";
import {
  titleCase,
  currency,
  currencyRounded
} from "utilities/date-format-utils";
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
              <span className={style.sum}>{currencyRounded(data.sum)}</span>
            </li>
          );
        })}
        <li className={style.categoryTotal}>
          <span className={style.name}>Total</span>
          <span className={style.sum}>{currencyRounded(categoryTotal)}</span>
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
      <div className={style.totalsContainer}>
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
