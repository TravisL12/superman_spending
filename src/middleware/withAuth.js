import React, { Component } from "react";
import AuthService from "./AuthService";

export default function withAuth(AuthComponent) {
  return class AuthWrapped extends Component {
    constructor() {
      super();
      this.state = {
        user: null
      };
    }

    componentWillMount() {
      if (!AuthService.loggedIn()) {
        this.props.history.replace("/login");
      } else {
        try {
          const user = AuthService.getProfile();
          this.setState({ user });
        } catch (err) {
          AuthService.logout();
          this.props.history.replace("/login");
        }
      }
    }

    render() {
      return this.state.user ? (
        <AuthComponent history={this.props.history} user={this.state.user} />
      ) : null;
    }
  };
}
