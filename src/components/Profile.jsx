import React, { Component } from "react";
import AuthService from "../middleware/AuthService";
import "./Profile.css";

class Profile extends Component {
  constructor() {
    super();
    this.Auth = new AuthService();
    this.state = {
      user: null,
      transactions: { recent: [], month: [] },
      selectedFile: null,
      isUploading: false
    };
  }

  componentWillMount() {
    this.Auth.fetch(`http://0.0.0.0:3000/api/user/profile`).then(
      ({ user, transactions }) => {
        this.setState({ user, transactions });
      }
    );
  }

  handleLogout = () => {
    this.Auth.logout();
    this.props.history.replace("/login");
  };

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

    this.setState({ isUploading: true });

    fetch("http://0.0.0.0:3000/api/transactions/import", {
      method: "POST",
      body,
      headers
    })
      .then(response => response.json())
      .then(response => {
        console.log(response);
        this.setState({ isUploading: false });
      });
  };

  render() {
    const { user, transactions } = this.state;
    const name = user ? user.name : "";

    return (
      <div>
        <div className="title">
          <h1>{name} is logged in!</h1>
          <input type="file" onChange={this.selectFile} />
          <button disabled={this.state.isUploading} onClick={this.uploadFile}>
            Upload
          </button>
          <button
            type="button"
            className="form-submit"
            onClick={this.handleLogout}
          >
            Logout
          </button>
        </div>

        <div className="recent-transactions">
          <ul>
            {transactions.recent.map((trans, idx) => {
              return <li key={idx}>{trans.description}</li>;
            })}
          </ul>
        </div>
      </div>
    );
  }
}

export default Profile;
