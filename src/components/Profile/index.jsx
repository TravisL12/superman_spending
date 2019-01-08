import React, { Component } from "react";
import AuthService from "../../middleware/AuthService";
import { currency } from "../../utilities/formatLocales";
import styles from "./Profile.module.scss";

class Profile extends Component {
  constructor() {
    super();
    this.state = {
      transactions: { recent: [], month: [] },
      isLoading: true
    };
  }

  componentWillMount() {
    AuthService.fetch("api/user/profile").then(({ transactions }) => {
      this.setState({ transactions, isLoading: false });
    });
  }

  render() {
    const { transactions, isLoading } = this.state;

    if (isLoading) {
      return <h1>Loading...</h1>;
    }

    return (
      <div>
        <div className={styles.recentTransactions} />
      </div>
    );
  }
}

export default Profile;
