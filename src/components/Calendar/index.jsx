import React, { Component } from "react";
import AuthService from "../../middleware/AuthService";
import CalendarGrid from "../CalendarGrid";
import YearSelector from "../YearSelector";
import MonthSelector from "../MonthSelector";
import { Route } from "react-router-dom";

class Calendar extends Component {
  constructor() {
    super();
    this.state = {
      years: [],
      yearData: null,
      isLoading: true
    };
  }

  componentWillMount() {
    AuthService.fetch("api/user/profile").then(({ years }) => {
      this.setState({ years, isLoading: false });
    });
  }

  monthData = yearData => {
    console.log(yearData);
    this.setState({ yearData });
  };

  render() {
    const { years, isLoading, yearData } = this.state;

    if (isLoading) {
      return <h1>Loading...</h1>;
    }

    return (
      <div>
        <Route
          path="/calendar"
          render={props => {
            return <YearSelector {...props} years={years} />;
          }}
        />
        <Route
          path="/calendar/:year"
          render={props => {
            return (
              <MonthSelector
                match={props.match}
                updateMonths={this.monthData}
              />
            );
          }}
        />
        <Route
          exact
          path="/calendar/:year/:month"
          render={props => {
            return <CalendarGrid {...props} yearData={yearData} />;
          }}
        />
      </div>
    );
  }
}

export default Calendar;
