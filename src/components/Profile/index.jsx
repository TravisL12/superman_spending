import React, { Component } from "react";
import AuthService from "../../middleware/AuthService";
import { currency, formatDate } from "../../utilities/formatLocales";
import styles from "./Profile.module.scss";

class Profile extends Component {
  constructor() {
    super();
    this.Auth = new AuthService();
    this.state = {
      user: null,
      transactions: { recent: [], month: [] },
      categories: null,
      isLoading: true
    };
  }

  componentWillMount() {
    this.Auth.fetch("api/user/profile").then(
      ({ user, transactions, categories }) => {
        this.setState({ user, transactions, categories, isLoading: false });
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
      const category = categories[id];

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

  // for quick test
  // render() {
  //   return <h1>Hi!</h1>;
  // }

  render() {
    const { transactions, isLoading, categories } = this.state;

    if (isLoading) {
      return <h1>Loading...</h1>;
    }

    transactions.recent.sum = transactions.recent.reduce((sum, i) => {
      return sum + i.amount;
    }, 0);

    return (
      <div>
        <div className={styles.recentTransactions}>
          <p>
            Sum of Last {transactions.recent.length}:{" "}
            {currency(transactions.recent.sum)}
          </p>
          <p>
            Avg.
            {currency(transactions.recent.sum / transactions.recent.length)}
          </p>
        </div>

        <div className={styles.categoryTransactions}>
          {categories.monthData.map((monthData, idx) => {
            return (
              <div className={styles.monthData} key={`month-${idx}`}>
                {formatDate(monthData.month, monthData.year)}
                <ul>
                  {this.createCategoryList(
                    categories.idGroup,
                    monthData.categories
                  )}
                  <li>
                    Total: {this.calculateCategoryTotal(monthData.categories)}
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

export default Profile;
