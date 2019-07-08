import React, { Component } from "react";
import CatgoriesProvider from "providers/CategoriesProvider";
import AuthService from "./AuthService";

export default function withAuth(AuthComponent) {
  return class AuthWrapped extends Component {
    state = {
      user: null
    };

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
        <CatgoriesProvider>
          <AuthComponent user={this.state.user} {...this.props} />
        </CatgoriesProvider>
      ) : null;
    }
  };
}
