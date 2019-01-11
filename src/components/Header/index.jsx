import React, { Component } from "react";
import LogoutButton from "../LogoutButton";
import TransactionImporter from "../TransactionImporter";
import AuthService from "../../middleware/AuthService";
import { NavLink } from "react-router-dom";
import styles from "./Header.module.scss";

class Header extends Component {
  constructor(props) {
    super();
    const isLoggedIn = AuthService.loggedIn();

    if (!isLoggedIn) {
      props.history.replace("/login");
    }

    this.state = { isLoggedIn };
  }

  componentWillReceiveProps() {
    this.setState({ isLoggedIn: AuthService.loggedIn() });
  }

  render() {
    if (!this.state.isLoggedIn) {
      return (
        <div className={styles.container}>
          <div className={styles.greeting}>
            <h1>Not logged in.</h1>
          </div>
        </div>
      );
    }

    return (
      <div className={styles.container}>
        <div className={styles.greeting}>
          <h1>Batman!</h1>
        </div>

        <div className={styles.navLinks}>
          <NavLink to="/calendar">Calendar</NavLink>
          <NavLink to="/categories">Categories</NavLink>
        </div>

        <div className={styles.logout}>
          <TransactionImporter />
          <LogoutButton {...this.props} />
        </div>
      </div>
    );
  }
}

export default Header;
