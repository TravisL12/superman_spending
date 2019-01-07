import React, { Component } from "react";
import AuthService from "./AuthService";

export default function withAuth(AuthComponent) {
  const Auth = new AuthService();

  return class AuthWrapped extends Component {
    constructor() {
      super();
      this.state = {
        user: null
      };
    }

    componentWillMount() {
      if (!Auth.loggedIn()) {
        this.props.history.replace("/login");
      } else {
        try {
          const user = Auth.getProfile();
          this.setState({ user });
        } catch (err) {
          Auth.logout();
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
