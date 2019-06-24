import React, { Component } from "react";
import AuthService from "../../middleware/AuthService";
import styles from "./Login.module.scss";

class Login extends Component {
  componentWillMount() {
    if (AuthService.loggedIn()) this.props.history.replace("/calendar");
  }

  render() {
    return (
      <div className={styles.center}>
        <div className={styles.card}>
          <form onSubmit={this.handleFormSubmit}>
            <input
              className={styles.formItem}
              placeholder="Email goes here..."
              name="email"
              type="text"
              onChange={this.handleChange}
            />
            <input
              className={styles.formItem}
              placeholder="Password goes here..."
              name="password"
              type="password"
              onChange={this.handleChange}
            />
            <input className={styles.formSubmit} value="SUBMIT" type="submit" />
          </form>
        </div>
      </div>
    );
  }

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleFormSubmit = e => {
    e.preventDefault();

    AuthService.login(this.state.email, this.state.password)
      .then(res => {
        this.props.history.replace("/calendar");
      })
      .catch(err => {
        alert(err);
      });
  };
}

export default Login;
