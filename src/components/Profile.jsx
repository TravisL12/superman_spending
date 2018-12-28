import React, { Component } from "react";
import AuthService from "../middleware/AuthService";
import "./Profile.css";

class Profile extends Component {
  constructor() {
    super();
    this.Auth = new AuthService();
    this.state = {
      user: null,
      selectedFile: null
    };
  }

  componentWillMount() {
    const { user_id } = this.Auth.getProfile();
    this.Auth.fetch(`http://0.0.0.0:3000/api/user/${user_id}`).then(user => {
      this.setState({ user });
    });
  }

  selectFile = event => {
    this.setState({
      selectedFile: event.target.files[0]
    });
  };

  uploadFile = () => {
    const data = new FormData();
    data.append("file", this.state.selectedFile);

    this.Auth.fetch("http://0.0.0.0:3000/api/transactions/import", {
      method: "POST",
      body: data
    }).then(response => {
      console.log(response);
    });
  };

  render() {
    const { user } = this.state;
    const name = user ? user.name : "";
    return (
      <div>
        <h1>{name} is logged in!</h1>
        <input type="file" onChange={this.selectFile} />
        <button onClick={this.uploadFile}>Upload</button>
      </div>
    );
  }
}

export default Profile;
