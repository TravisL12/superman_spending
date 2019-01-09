import React, { Component } from "react";
import { formatDate } from "../../utilities/formatLocales";
// import styles from "./MonthSelector.module.scss";
import { Link } from "react-router-dom";

class MonthSelector extends Component {
  constructor(props) {
    super();
    this.state = {
      year: props.match.params.year
    };
  }

  componentWillReceiveProps(newProps) {
    this.setState({ year: newProps.match.params.year });
  }

  render() {
    const months = Array.from({ length: 12 }, (v, k) => k + 1);
    const { year } = this.state;

    return months.map(num => {
      return (
        <span key={`month-${num}`}>
          <Link to={`/calendar/${year}/${num}`}>
            {formatDate(num - 1, year, { month: "long" })}
          </Link>
        </span>
      );
    });
  }
}

export default MonthSelector;
