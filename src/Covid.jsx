import React, { Component } from "react";
import "./Covid.css";
import _ from "lodash";

export default class Covid extends Component {
  constructor() {
    super();
    this.state = { data: [], filteredData: [], filterValue: "" };
  }

  componentDidMount() {
    fetch(`https://corona.lmao.ninja/countries?sort=cases`)
      .then(res => res.json())
      .then(json => this.setState({ data: json, filteredData: json }));
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
      .then(this.debounceChangeHandler(this.state.filterValue));
  };

  getUpdatedTimeInfo = () => {
    let epochDate = this.state.data[0] ? this.state.data[0].updated : null;
    let dateString = new Date(epochDate).toLocaleString().split(",");
    let formattedDateString = `${dateString[1]}, ${dateString[0]}`;
    return formattedDateString;
  };

  debounceChangeHandler = _.debounce(searchQuery => {
    let items = this.state.data;
    items = _.filter(items, item => {
      return (
        item.country.toLowerCase().search(searchQuery.toLowerCase()) !== -1
      );
    });
    this.setState({ filteredData: items });
  }, 250);

  filterList = event => {
    let searchQuery = event.target.value;
    this.setState({ filterValue: searchQuery });
    this.debounceChangeHandler(searchQuery);
  };

  clearFilter = () => {
    this.setState({ filterValue: "" }, () => this.refreshData());
  };

  addCommasToNumber(x) {
    console.log("derd commas", x);
    return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
  }

  render() {
    const { filteredData, filterValue } = this.state;

    return (
      <div>
        <div className={"container"}>
          {this.state.data.length ? (
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
                >{`Data Updated: ${this.getUpdatedTimeInfo()}`}</div>
              </div>
            </div>
          ) : null}

          <div className={"Search"}>
            {this.state.data.length ? (
              <form>
                <input
                  type="text"
                  value={filterValue}
                  placeholder="Search"
                  onChange={this.filterList}
                />
                {this.state.filterValue ? (
                  <span class={"FilterClear"} onClick={this.clearFilter}>
                    &times;
                  </span>
                ) : null}
              </form>
            ) : null}
          </div>

          <table id="Header" className={"Table"}>
            <tbody>
              <tr className={"TitleRow"}>
                <th className={"Col"}>Country</th>
                <th className={"Col"}>Case Count(+new)</th>
                <th className={"Col"}>Active Case Count</th>
                <th className={"Col"}>Deaths(+new)</th>
              </tr>
            </tbody>
          </table>

          <div style={{ height: window.innerHeight }} className={"Scroll"}>
            {filteredData.map((el, index) => (
              <table className={"Table"} key={el.country}>
                <tbody>
                  <tr className={"Row"} key={el.country}>
                    <td className={"Col"}>
                      {index + 1 + "."}
                      <img
                        src={el.countryInfo.flag}
                        height={15}
                        width={15}
                        alt={el.countryInfo.flag}
                      />
                      {"   " + el.country}
                    </td>
                    <td className={"Col"}>{`${this.addCommasToNumber(
                      el.cases
                    )} (+${this.addCommasToNumber(el.todayCases)})`}</td>
                    <td className={"Col"}>
                      {this.addCommasToNumber(el.active)}
                    </td>
                    <td className={"Col"}>{`${this.addCommasToNumber(
                      el.deaths
                    )} (+${this.addCommasToNumber(el.todayDeaths)})`}</td>
                  </tr>
                </tbody>
              </table>
            ))}
          </div>
        </div>
      </div>
    );
  }
}
