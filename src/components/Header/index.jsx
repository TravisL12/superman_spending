import React, { Component } from "react";
import LogoutButton from "../LogoutButton";
import TransactionImporter from "../TransactionImporter";
import AuthService from "../../middleware/AuthService";

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
        <div>
          <h1>You're logged in!</h1>
          <TransactionImporter />
          <LogoutButton {...this.props} />
        </div>
      );
    } else {
      return <h1>Not logged in.</h1>;
    }
  }
}

export default Header;
