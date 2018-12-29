import React, { Component } from "react";
import AuthService from "../middleware/AuthService";
import "./Login.css";

class Login extends Component {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
    this.Auth = new AuthService();
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  componentWillMount() {
    if (this.Auth.loggedIn()) this.props.history.replace("/profile");
  }

  render() {
    return (
      <div className="center">
        <div className="card">
          <form onSubmit={this.handleFormSubmit}>
            <input
              className="form-item"
              placeholder="Email goes here..."
              name="email"
              type="text"
              onChange={this.handleChange}
            />
            <input
              className="form-item"
              placeholder="Password goes here..."
              name="password"
              type="password"
              onChange={this.handleChange}
            />
            <input className="form-submit" value="SUBMIT" type="submit" />
          </form>
        </div>
      </div>
    );
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleFormSubmit(e) {
    e.preventDefault();

    this.Auth.login(this.state.email, this.state.password)
      .then(res => {
        this.props.history.replace("/profile");
      })
      .catch(err => {
        alert(err);
      });
  }
}

export default Login;
