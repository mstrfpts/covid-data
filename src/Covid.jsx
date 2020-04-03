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
        <div className={"container"}>
          <div className={"MajorCounts"}>
            {dataReady ? (
              <div>
                <div className={"PageHeader"}>CoVid-19</div>
                <div>{`Total Cases: ${this.getTotalCases()}`}</div>
                <div>{`Active Cases: ${this.getActiveCases()}`}</div>
                <div>{`Deaths: ${this.getDeaths()}`}</div>
              </div>
            ) : null}
          </div>

          <tr className={"TitleRow"}>
            <th className={"Col"}>Country</th>
            <th className={"Col"}>Case Count(+new)</th>
            <th className={"Col"}>Active Case Count(+new)</th>
            <th className={"Col"}>Deaths(+new)</th>
          </tr>

          {data.map(el => (
            <tr className={"Row"} key={el.country}>
              <td className={"Col"}>{el.country}</td>
              <td className={"Col"}>{`${el.cases} (+${el.todayCases})`}</td>
              <td className={"Col"}>{el.active}</td>
              <td className={"Col"}>{`${el.deaths} (+${el.todayCases})`}</td>
            </tr>
          ))}
        </div>
      </div>
    );
  }
}
