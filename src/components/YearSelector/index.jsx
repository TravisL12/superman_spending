import React, { Component } from "react";
import AuthService from "../../middleware/AuthService";
import Calendar from "../Calendar";
import MonthSelector from "../MonthSelector";
import styles from "./YearSelector.module.scss";
import { Route, NavLink } from "react-router-dom";

class YearSelector extends Component {
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
      return <h1>Loading...</h1>;
    }

    return (
      <div>
        <div className={styles.years}>
          {years.map(year => {
            return (
              <NavLink
                activeClassName={styles.active}
                to={`/calendar/${year}`}
                key={year}
              >
                <div className={styles.singleItem} key={year}>
                  {year}
                </div>
              </NavLink>
            );
          })}
        </div>

        <Route path="/calendar/:year" component={MonthSelector} />
        <Route exact path="/calendar/:year/:month" component={Calendar} />
      </div>
    );
  }
}

export default YearSelector;
