import React, { Component, Fragment } from "react";
import AuthService from "../../middleware/AuthService";

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
    this.setState({ isUploading: true });

    const isMultiPart = true;
    const body = new FormData();
    body.append("file", this.state.selectedFile);

    this.Auth.fetch(
      "api/transactions/import",
      {
        method: "POST",
        body
      },
      isMultiPart
    ).then(response => {
      console.log(response.message);
      this.setState({ selectedFile: null, isUploading: false });
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
