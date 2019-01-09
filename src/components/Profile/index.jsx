import React, { Component } from "react";
import AuthService from "../../middleware/AuthService";

class Profile extends Component {
  constructor() {
    super();
    this.state = {
      user: null,
      years: [],
      isLoading: true
    };
  }

  componentWillMount() {
    AuthService.fetch("api/user/profile").then(({ user, years }) => {
      this.setState({ user, years, isLoading: false });
    });
  }

  render() {
    const { user, years, isLoading } = this.state;

    if (isLoading) {
      return <h1>Loading...</h1>;
    }

    return (
      <div>
        <div>{user.name}</div>
        {years.map(year => {
          return <h3 key={year}>{year}</h3>;
        })}
      </div>
    );
  }
}

export default Profile;
