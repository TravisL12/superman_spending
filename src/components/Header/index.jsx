import React, { Component } from "react";
import LogoutButton from "../LogoutButton";
import TransactionImporter from "../TransactionImporter";
import AuthService from "../../middleware/AuthService";
import styles from "./Header.module.scss";

class Header extends Component {
  constructor() {
    super();
    this.state = {
      isLoggedIn: AuthService.loggedIn()
    };
  }

  componentWillReceiveProps() {
    this.setState({ isLoggedIn: AuthService.loggedIn() });
  }

  render() {
    if (this.state.isLoggedIn) {
      return (
        <div className={styles.container}>
          <h1>You're logged in!</h1>
          <div>
            <TransactionImporter />
            <LogoutButton {...this.props} />
          </div>
        </div>
      );
    } else {
      return <h1>Not logged in.</h1>;
    }
  }
}

export default Header;
