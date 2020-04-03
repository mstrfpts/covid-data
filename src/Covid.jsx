import React, { Component } from "react";
import "./Covid.css";
import _ from "lodash";

export default class Covid extends Component {
  constructor() {
    super();
    this.state = { data: [], dataReady: false };
  }

  componentDidMount() {
    fetch(`https://corona.lmao.ninja/countries`)
      .then(res => res.json())
      .then(json => this.setState({ data: json }))
      .then(this.setState({ dataReady: true }));
  }

  getTotalCases = () => {
    let sumIs = _.sumBy(this.state.data, el => {
      return el.cases;
    });
    return sumIs;
  };

  getActiveCases = () => {
    let sumIs = _.sumBy(this.state.data, el => {
      return el.active;
    });
    return sumIs;
  };

  getDeaths = () => {
    let sumIs = _.sumBy(this.state.data, el => {
      return el.deaths;
    });
    return sumIs;
  };

  render() {
    console.log("derd", this.state);
    const { data, dataReady } = this.state;

    return (
      <div>
        <div className={"MajorCounts"}>
          {dataReady ? (
            <div>
              CoVid-19
              <div>{`Total Cases: ${this.getTotalCases()}`}</div>
              <div>{`Active Cases: ${this.getActiveCases()}`}</div>
              <div>{`Deaths: ${this.getDeaths()}`}</div>
            </div>
          ) : null}
        </div>

        <tr className={"TitleRow"}>
          <th className={"Col"}>Country</th>
          <th className={"Col"}>Case Count</th>
          <th className={"Col"}>Active Case Count</th>
          <th className={"Col"}>Deaths</th>
        </tr>

        {data.map(el => (
          <tr className={"Row"} key={el.country}>
            <td className={"Col"}>{el.country}</td>
            <td className={"Col"}>{el.cases}</td>
            <td className={"Col"}>{el.active}</td>
            <td className={"Col"}>{el.deaths}</td>
          </tr>
        ))}
      </div>
    );
  }
}
