import React, { Component } from "react";
import AuthService from "../../middleware/AuthService";
import { currency, formatDate } from "../../utilities/formatLocales";
import styles from "./Categories.module.scss";
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
    return currency(total);
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
          {name} {currency(sum)}
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
        <div className={styles.categoryTransactions}>
          {categories.map((monthData, idx) => {
            return (
              <div className={styles.monthData} key={`month-${idx}`}>
                {formatDate(monthData.month, monthData.year)}
                <ul>
                  {this.createCategoryList(categoryIds, monthData.categoryData)}
                  <li>
                    Total: {this.calculateCategoryTotal(monthData.categoryData)}
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
