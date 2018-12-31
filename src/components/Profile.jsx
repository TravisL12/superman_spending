import React, { Component } from "react";
import AuthService from "../middleware/AuthService";
import currency from "../utilities/formatCurrency";
import "./Profile.css";

class Profile extends Component {
  constructor() {
    super();
    this.Auth = new AuthService();
    this.state = {
      user: null,
      transactions: { recent: [], month: [] },
      categories: null,
      selectedFile: null,
      isUploading: false,
      isLoading: true
    };
  }

  componentWillMount() {
    this.Auth.fetch("api/user/profile").then(
      ({ user, transactions, categories }) => {
        this.setState({ user, transactions, categories, isLoading: false });
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

    fetch("api/transactions/import", {
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
    const {
      user,
      transactions,
      isUploading,
      isLoading,
      categories
    } = this.state;

    if (isLoading) {
      return <h1>Loading...</h1>;
    }

    const recentSum = transactions.recent.reduce((sum, i) => {
      return sum + i.amount;
    }, 0);

    const monthSum = transactions.month.reduce((sum, i) => {
      return sum + i.amount;
    }, 0);

    return (
      <div>
        <div className="title">
          <h1>{user.name} is logged in!</h1>
          <input type="file" onChange={this.selectFile} />
          <button disabled={isUploading} onClick={this.uploadFile}>
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
          <p>
            Recent Sum: {currency(recentSum / 100)} (last{" "}
            {transactions.recent.length} transactions)
          </p>
          <p>Current Month Sum: {currency(monthSum / 100)}</p>
        </div>

        <div className="category-transactions">
          <ul>
            {categories.map((category, idx) => {
              const sum = category.Transactions.reduce((sum, i) => {
                return sum + i.amount;
              }, 0);
              return (
                <li key={idx}>
                  {category.name} {currency(sum / 100)}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    );
  }
}

export default Profile;
