import React, { Component } from "react";
import AuthService from "../middleware/AuthService";
import "./Profile.css";

class Profile extends Component {
  constructor() {
    super();
    this.Auth = new AuthService();
    this.state = { user: null, transactions: [], selectedFile: null };
  }

  componentWillMount() {
    const { user_id } = this.Auth.getProfile();
    this.Auth.fetch(`http://0.0.0.0:3000/api/user/${user_id}`).then(
      ({ user, transactions }) => {
        this.setState({ user, transactions });
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
    const { user, transactions } = this.state;
    const name = user ? user.name : "";

    return (
      <div>
        <h1>
          {name} is logged in! ({transactions.length || 0} count)
        </h1>
        <input type="file" onChange={this.selectFile} />
        <button onClick={this.uploadFile}>Upload</button>
      </div>
    );
  }
}

export default Profile;
