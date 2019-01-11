import React, { Component } from "react";
import AuthService from "../../middleware/AuthService";
import YearSelector from "../YearSelector";
import { Route } from "react-router-dom";

class Calendar extends Component {
  constructor() {
    super();
    this.state = {
      years: [],
      isLoading: true
    };
  }

  componentWillMount() {
    AuthService.fetch("api/user/profile").then(({ years }) => {
      this.setState({ years, isLoading: false });
    });
  }

  render() {
    const { years, isLoading } = this.state;

    if (isLoading) {
      return <p />;
    }

    return (
      <div className={"calendar"}>
        <Route
          path="/calendar"
          render={props => {
            return <YearSelector {...props} years={years} />;
          }}
        />
      </div>
    );
  }
}

export default Calendar;
