import React, { Component } from "react";
import "./Covid.css";
import _ from "lodash";

export default class Covid extends Component {
  constructor() {
    super();
    this.state = { data: [], dataReady: false, updated: `` };
  }

  componentDidMount() {
    fetch(`https://corona.lmao.ninja/countries`)
      .then(res => res.json())
      .then(json => this.setState({ data: json }))
      .then(this.setState({ dataReady: true }));
  }

  getTotalCases = () => {
    let sumIs = _.sumBy(this.state.data, el => {
      if (el.country === "World") {
        return 0;
      } else {
        return el.cases;
      }
    });
    return sumIs;
  };

  getActiveCases = () => {
    let sumIs = _.sumBy(this.state.data, el => {
      if (el.country === "World") {
        return 0;
      } else {
        return el.active;
      }
    });
    return sumIs;
  };

  getDeaths = () => {
    let sumIs = _.sumBy(this.state.data, el => {
      if (el.country === "World") {
        return 0;
      } else {
        return el.deaths;
      }
    });
    return sumIs;
  };

  getRecoveredCases = () => {
    let sumIs = _.sumBy(this.state.data, el => {
      if (el.country === "World") {
        return 0;
      } else {
        return el.recovered;
      }
    });
    return sumIs;
  };

  refreshData = () => {
    fetch(`https://corona.lmao.ninja/countries`)
      .then(res => res.json())
      .then(json => this.setState({ data: json }))
      .then(this.setState({ dataReady: true }));
  };

  getUpdatedTimeInfo = () => {
    let epochDate = this.state.data[0] ? this.state.data[0].updated : null;
    let dateArray = (new Date(epochDate) + "").split(" ");
    return `${dateArray[4]} ${dateArray[5]}`;
  };

  render() {
    const { data, dataReady } = this.state;

    return (
      <div>
        <div className={"container"}>
          {dataReady ? (
            <div className="Header">
              <div className={"Title"}>CoVid-19</div>
              <div className={"MajorCounts"}>
                <div>{`Total Cases: ${this.getTotalCases()}`}</div>
                <div>{`Active: ${this.getActiveCases()}`}</div>
                <div> {`Recovered: ${this.getRecoveredCases()}`}</div>
                <div> {`Deaths: ${this.getDeaths()}`}</div>
              </div>
              <div className={"Refresh"}>
                <button onClick={this.refreshData}>Refresh</button>
                <div
                  className={"UpdatedTime"}
                >{`Data Updated at ${this.getUpdatedTimeInfo()}`}</div>
              </div>
            </div>
          ) : null}

          <tr className={"TitleRow"}>
            <th className={"Col"}>Country</th>
            <th className={"Col"}>Case Count(+new)</th>
            <th className={"Col"}>Active Case Count</th>
            <th className={"Col"}>Deaths(+new)</th>
          </tr>

          {data.map(el => (
            <tr className={"Row"} key={el.country}>
              <td className={"Col"}>{el.country}</td>
              <td className={"Col"}>{`${el.cases} (+${el.todayCases})`}</td>
              <td className={"Col"}>{el.active}</td>
              <td className={"Col"}>{`${el.deaths} (+${el.todayDeaths})`}</td>
            </tr>
          ))}
        </div>
      </div>
    );
  }
}
