import React, { Component, Fragment } from "react";
import AuthService from "../middleware/AuthService";

class TransactionImporter extends Component {
  constructor() {
    super();
    this.Auth = new AuthService();
    this.state = {
      selectedFile: null,
      isUploading: false
    };
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
    return (
      <Fragment>
        <input type="file" onChange={this.selectFile} />
        <button
          disabled={this.state.isUploading || !this.state.selectedFile}
          onClick={this.uploadFile}
        >
          Upload
        </button>
      </Fragment>
    );
  }
}

export default TransactionImporter;
