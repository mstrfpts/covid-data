import React, { Component } from "react";
import "./Covid.css";
import _ from "lodash";

export default class Covid extends Component {
  constructor() {
    super();
    this.state = { data: [], DataReady: false };
  }

  componentDidMount() {
    fetch(`https://corona.lmao.ninja/countries`)
      .then(res => res.json())
      .then(json => this.setState({ data: json }))
      .then(this.setState({ DataReady: true }));
  }

  getTotalCases = () => {
    let sumis = _.sumBy(this.state.data, el => {
      return el.cases;
    });
    return sumis;
  };

  getActiveCases = () => {
    let sumis = _.sumBy(this.state.data, el => {
      return el.active;
    });
    return sumis;
  };

  getDeaths = () => {
    let sumis = _.sumBy(this.state.data, el => {
      return el.deaths;
    });
    return sumis;
  };

  render() {
    return (
      <div>
        <div className={"MajorCounts"}>
          {this.state.DataReady ? (
            <div>
              CoVid-19
              <div>{`Total Cases: ${this.getTotalCases()}`}</div>
              <div>{`Active Cases: ${this.getActiveCases()}`}</div>
              <div>{`Deaths: ${this.getDeaths()}`}</div>
            </div>
          ) : null}
        </div>

        <tr className={"TitleRow"}>
          <th className={"TitleCol"}>Country</th>
          <th className={"TitleCol"}>Case Count</th>
          <th className={"TitleCol"}>Active Case Count</th>
          <th className={"TitleCol"}>Deaths</th>
        </tr>

        {this.state.data.map(el => (
          <tr className={"Row"} key={el.country}>
            <td className={"TitleCol"}>{el.country}</td>
            <td className={"TitleCol"}>{el.cases}</td>
            <td className={"TitleCol"}>{el.active}</td>
            <td className={"TitleCol"}>{el.deaths}</td>
          </tr>
        ))}
      </div>
    );
  }
}
