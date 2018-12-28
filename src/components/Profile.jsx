import React, { Component } from "react";
import AuthService from "../middleware/AuthService";
import "./Profile.css";

class Profile extends Component {
  constructor() {
    super();
    this.Auth = new AuthService();
    this.state = {
      user: null
    };
  }

  componentWillMount() {
    const { user_id } = this.Auth.getProfile();
    this.Auth.fetch(`http://0.0.0.0:3000/api/user/${user_id}`).then(user => {
      this.setState({ user });
    });
  }

  render() {
    const { user } = this.state;
    const name = user ? user.name : "";
    return (
      <div>
        <h1>{name} is logged in!</h1>
      </div>
    );
  }
}

export default Profile;
