import React, { Component } from "react";
import AuthService from "../../middleware/AuthService";
import { currency } from "../../utilities/formatLocales";
import styles from "./Profile.module.scss";

class Profile extends Component {
  constructor() {
    super();
    this.state = {
      user: null,
      transactions: { recent: [], month: [] },
      isLoading: true
    };
  }

  componentWillMount() {
    AuthService.fetch("api/user/profile").then(({ user, transactions }) => {
      this.setState({ user, transactions, isLoading: false });
    });
  }

  render() {
    const { transactions, isLoading } = this.state;

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
      </div>
    );
  }
}

export default Profile;
