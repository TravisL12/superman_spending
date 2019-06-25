import React, { Component } from "react";
import style from "./TransactionsInputs.module.scss";
import AuthService from "middleware/AuthService";

class TransactionImporter extends Component {
  state = {
    selectedFile: null,
    isUploading: false,
    uploadComplete: false
  };

  selectFile = event => {
    this.setState({
      selectedFile: event.target.files[0],
      uploadComplete: false
    });
  };

  uploadFile = () => {
    this.setState({ isUploading: true });

    const isMultiPart = true;
    const body = new FormData();
    body.append("file", this.state.selectedFile);

    AuthService.fetch(
      "api/transactions/import",
      {
        method: "POST",
        body
      },
      isMultiPart
    ).then(response => {
      this.setState(
        {
          selectedFile: null,
          isUploading: false,
          uploadComplete: true
        },
        this.props.callback
      );
    });
  };

  render() {
    const isUploading = this.state.isUploading && <p>Upload in Progress!</p>;
    const uploadComplete = this.state.uploadComplete && <p>Upload Complete!</p>;

    return (
      <div className={style.importerContainer}>
        <input type="file" onChange={this.selectFile} />
        <button
          disabled={this.state.isUploading || !this.state.selectedFile}
          onClick={this.uploadFile}
        >
          Upload
        </button>
        {isUploading}
        {uploadComplete}
      </div>
    );
  }
}

export default TransactionImporter;
