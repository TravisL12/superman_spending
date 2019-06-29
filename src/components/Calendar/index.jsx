import React, { Component } from "react";
import { Route, NavLink } from "react-router-dom";

import AuthService from "middleware/AuthService";
import style from "components/Calendar/Selector.module.scss";
import MonthSelector from "components/Calendar/MonthSelector";
import Loading from "components/Loading";

class Calendar extends Component {
  state = {
    years: [],
    isLoading: true
  };

  componentWillMount() {
    AuthService.fetch("api/user/profile").then(({ years }) => {
      this.setState({ years, isLoading: false });
    });
  }

  render() {
    const { match } = this.props;
    const { years, isLoading } = this.state;

    if (isLoading) return <Loading />;

    return (
      <div>
        <div className={style.years}>
          {years.map(year => {
            return (
              <NavLink
                className={style.itemContainer}
                activeClassName={style.active}
                to={`/calendar/${year}`}
                key={year}
              >
                <div className={style.singleItem} key={year}>
                  {year}
                </div>
              </NavLink>
            );
          })}
        </div>
        <Route path={`${match.path}/:year`} component={MonthSelector} />
      </div>
    );
  }
}

export default Calendar;
