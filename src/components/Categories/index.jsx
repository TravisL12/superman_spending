import React, { Component } from "react";
import AuthService from "../../middleware/AuthService";
import { currency, formatDate } from "../../utilities/formatLocales";
import style from "./Categories.module.scss";
import { find } from "lodash";

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

  calculateCategoryTotal = categories => {
    const total = Object.keys(categories).reduce((sum, id) => {
      return (
        sum +
        categories[id].Transactions.reduce((sum, i) => {
          return sum + i.amount;
        }, 0)
      );
    }, 0);
    return currency(total, {
      minimumFractionDigits: 0,
      rounded: true
    });
  };

  createCategoryList = (idGroup, categories) => {
    return Object.keys(idGroup).map(id => {
      const name = idGroup[id];
      const category = find(categories, o => {
        return o.id === parseInt(id);
      });

      const sum = category
        ? category.Transactions.reduce((sum, i) => {
            return sum + i.amount;
          }, 0)
        : 0;

      return (
        <li key={`group-${id}`}>
          <span className={style.name}>{name}</span>
          <span className={style.sum}>{currency(sum)}</span>
        </li>
      );
    });
  };

  render() {
    const { isLoading, categories, categoryIds } = this.state;

    if (isLoading) {
      return <h1>Loading...</h1>;
    }

    return (
      <div>
        <div className={style.categoryTransactions}>
          {categories.map((monthData, idx) => {
            return (
              <div className={style.monthData} key={`month-${idx}`}>
                <span className={style.monthName}>
                  {formatDate(monthData.month, monthData.year)}
                </span>
                <ul>
                  {this.createCategoryList(categoryIds, monthData.categoryData)}
                  <li className={style.categoryTotal}>
                    <span className={style.name}>Total</span>
                    <span className={style.sum}>
                      {this.calculateCategoryTotal(monthData.categoryData)}
                    </span>
                  </li>
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default Categories;
