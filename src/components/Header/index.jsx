import React, { Component } from "react";
import LogoutButton from "../LogoutButton";
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
          <h1>Superman!</h1>
        </div>

        <div className={styles.navLinks}>
          <NavLink activeClassName={styles.active} to="/calendar">
            Calendar
          </NavLink>
          <NavLink activeClassName={styles.active} to="/categories">
            Categories
          </NavLink>
          <NavLink activeClassName={styles.active} to="/transactions">
            Transactions
          </NavLink>
        </div>

        <div className={styles.logout}>
          <LogoutButton {...this.props} />
        </div>
      </div>
    );
  }
}

export default Header;
