import React, { Component } from "react";
import AuthService from "../../middleware/AuthService";
import { currency, formatDate } from "../../utilities/formatLocales";
import style from "./Categories.module.scss";
import { values, keys } from "lodash";

class Categories extends Component {
  constructor() {
    super();
    this.state = {
      categories: null,
      categoryIds: null,
      isLoading: true
    };
  }

  componentWillMount() {
    AuthService.fetch("api/categories/compare").then(
      ({ categories, category_ids }) => {
        this.setState({
          categories,
          categoryIds: category_ids,
          isLoading: false
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
      sum += this.sumTransactions(c);
      return sum;
    }, 0);
    return currency(total, {
      minimumFractionDigits: 0,
      rounded: true
    });
  };

  createCategoryRow = (categories, id) => {
    return categories.map((cat, cidx) => {
      const data = cat.categoryData[id];
      const sum = data ? this.sumTransactions(data) : 0;
      return (
        <td className={style.amountCol} key={`cat-${cidx}`}>
          {currency(sum)}
        </td>
      );
    });
  };

  render() {
    const { isLoading, categories, categoryIds } = this.state;

    if (isLoading) return null;

    return (
      <div className={style.categoryTransactions}>
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
              return (
                <tr key={`name-${idx}`}>
                  <td className={style.categoryCol}>{categoryIds[id].name}</td>
                  {this.createCategoryRow(categories, id)}
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
    );
  }
}

export default Categories;
