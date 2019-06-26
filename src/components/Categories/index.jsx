import React, { Component } from "react";
import AuthService from "middleware/AuthService";
import { currency, formatDate } from "utilities/formatLocales";
import style from "./Categories.module.scss";
import { values, keys } from "lodash";

class Categories extends Component {
  state = {
    categories: null,
    categoryIds: null,
    isLoading: true,
    checkedCategories: {}
  };

  componentWillMount() {
    AuthService.fetch("api/categories/compare").then(
      ({ categories, category_ids }) => {
        const checkedCategories = Object.keys(category_ids).reduce(
          (result, id) => {
            result[id] = true;
            return result;
          },
          {}
        );
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

  createCategoryRow = (categories, id) => {
    return categories.map((cat, cidx) => {
      let sum = 0;
      if (this.state.checkedCategories[id]) {
        const data = cat.categoryData[id];
        sum = data ? this.sumTransactions(data) : 0;
      }

      return (
        <td className={style.amountCol} key={`cat-${cidx}`}>
          {currency(sum)}
        </td>
      );
    });
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

    if (isLoading) return null;

    return (
      <div className={style.categoryTransactions}>
        <table>
          <thead>
            <tr>
              <th />
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
