import React, { Component } from "react";
import AuthService from "../../middleware/AuthService";
import YearSelector from "../YearSelector";
import { Route } from "react-router-dom";

class Calendar extends Component {
  constructor() {
    super();
    this.state = {
      yearsList: [],
      isLoading: true
    };
  }

  componentWillMount() {
    AuthService.fetch("api/user/profile").then(({ years }) => {
      this.setState({ yearsList: years, isLoading: false });
    });
  }

  render() {
    const { yearsList, isLoading } = this.state;

    if (isLoading) {
      return <div />;
    }

    return (
      <div className={"calendar"}>
        <Route
          path="/calendar"
          render={props => {
            return <YearSelector {...props} years={yearsList} />;
          }}
        />
      </div>
    );
  }
}

export default Calendar;
