import React, { Component } from "react";
import AuthService from "../middleware/AuthService";
import "./Profile.css";

class Profile extends Component {
  constructor() {
    super();
    this.Auth = new AuthService();
    this.state = { user: null, recentTransactions: [], selectedFile: null };
  }

  componentWillMount() {
    this.Auth.fetch(`http://0.0.0.0:3000/api/user/profile`).then(
      ({ user, recentTransactions }) => {
        this.setState({ user, recentTransactions });
      }
    );
  }

  selectFile = event => {
    this.setState({
      selectedFile: event.target.files[0]
    });
  };

  uploadFile = () => {
    const body = new FormData();
    body.append("file", this.state.selectedFile);

    const headers = {
      Accept: "application/json",
      Authorization: this.Auth.getToken()
    };

    fetch("http://0.0.0.0:3000/api/transactions/import", {
      method: "POST",
      body,
      headers
    })
      .then(response => response.json())
      .then(response => {
        console.log(response);
      });
  };

  render() {
    const { user, recentTransactions } = this.state;
    const name = user ? user.name : "";

    return (
      <div>
        <div className="title">
          <h1>{name} is logged in!</h1>
          <input type="file" onChange={this.selectFile} />
          <button onClick={this.uploadFile}>Upload</button>
        </div>

        <div className="recent-transactions">
          {recentTransactions.map((trans, idx) => {
            return <p key={idx}>{trans.description}</p>;
          })}
        </div>
      </div>
    );
  }
}

export default Profile;
