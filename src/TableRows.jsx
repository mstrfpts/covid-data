import React, { Component } from "react";
import "./TableRows.css";

export default class TableRows extends Component {
  addCommasToNumber(x) {
    if (Number.isInteger(x)) {
      return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
    } else {
      return 0;
    }
  }

  clickHandler = () => {
    this.props.updateGraph(this.props.row.country);
  };

  render() {
    const { index } = this.props;
    const {
      _id,
      country,
      cases,
      todayCases,
      deaths,
      todayDeaths,
      tests,
      active
    } = this.props.row;
    const { flag } = this.props.row.countryInfo;

    return (
      <tr className={"row"} key={_id} onClick={this.clickHandler}>
        <td className={"column"}>
          {`${index + 1}. `}

          {<img src={flag} height={15} width={15} alt={flag} />}
          {` ${country}`}
        </td>
        <td className={"column"}>{`${this.addCommasToNumber(
          cases
        )} (+${this.addCommasToNumber(todayCases)})`}</td>
        <td className={"column"}>{this.addCommasToNumber(active)}</td>
        <td className={"column"}>{`${this.addCommasToNumber(
          deaths
        )} (+${this.addCommasToNumber(todayDeaths)})`}</td>
        <td className={"column"}>{`${this.addCommasToNumber(tests)}`}</td>
      </tr>
    );
  }
}
