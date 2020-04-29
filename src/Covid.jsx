import React, { Component } from "react";
import "./Covid.css";
import _ from "lodash";
import TableRows from "./TableRows";
import Chart from "./Chart";

export default class Covid extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
      filteredData: [],
      filterValue: "",
      countrySelected: {},
      displayGraph: true,
      historicalDataFetched: true
    };
  }

  componentDidMount() {
    fetch(`https://corona.lmao.ninja/v2/countries?sort=cases`)
      .then(res => res.json())
      .then(json =>
        this.setState(
          {
            data: json,
            filteredData: json
          },
          () => this.updateGraph(json[0].country)
        )
      );
  }

  getTotalCases = () => {
    let sumIs = _.sumBy(this.state.data, el => {
      if (el.country === "World") {
        return 0;
      } else {
        return el.cases;
      }
    });
    return this.addCommasToNumber(sumIs);
  };

  getActiveCases = () => {
    let sumIs = _.sumBy(this.state.data, el => {
      if (el.country === "World") {
        return 0;
      } else {
        return el.active;
      }
    });
    return this.addCommasToNumber(sumIs);
  };

  getDeaths = () => {
    let sumIs = _.sumBy(this.state.data, el => {
      if (el.country === "World") {
        return 0;
      } else {
        return el.deaths;
      }
    });
    return this.addCommasToNumber(sumIs);
  };

  getRecoveredCases = () => {
    let sumIs = _.sumBy(this.state.data, el => {
      if (el.country === "World") {
        return 0;
      } else {
        return el.recovered;
      }
    });
    return this.addCommasToNumber(sumIs);
  };

  refreshData = () => {
    fetch(`https://corona.lmao.ninja/v2/countries?sort=cases`)
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
    return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
  }

  toggleGraphicalView = () => {
    console.log("derd state", this.state);
    this.setState({ displayGraph: !this.state.displayGraph });
  };

  scrollHeightSetter = () => {
    let scrollHeight = this.state.displayGraph
      ? window.innerHeight - 460
      : window.innerHeight - 220;

    return scrollHeight;
  };

  updateCountryHistoricalData = countryData => {
    this.setState({
      countrySelected: {
        ...this.state.countrySelected,
        historicalData: countryData
      }
    });
  };

  updateGraph = countryClicked => {
    let countrySelectedHistoricalData;
    this.setState(
      {
        countrySelected: {
          country: countryClicked
        }
      },
      () => {
        fetch(`https://corona.lmao.ninja/v2/historical/${countryClicked}`)
          .then(response => {
            if (response.ok) {
              this.setState({ historicalDataFetched: true });
              return response.json();
            } else {
              this.setState({ historicalDataFetched: false });
              throw new Error("Historical fetch failed/timeout");
            }
          })
          .then(json => (countrySelectedHistoricalData = json))
          .then(countrySelectedHistoricalData =>
            this.updateCountryHistoricalData(
              countrySelectedHistoricalData.timeline
            )
          )
          .catch(error => {
            console.log(error);
          });
      }
    );
  };

  render() {
    const { filteredData, filterValue } = this.state;

    return (
      <div className={"imageContainer"}>
        <div className={"backgroundContainer"}>
          <div>
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

            <div className={"countryStats"}>
              <div className={"graphDisplay"}>
                {this.state.displayGraph ? (
                  <button onClick={this.toggleGraphicalView}>
                    Close Graphical View
                  </button>
                ) : (
                  <button onClick={this.toggleGraphicalView}>
                    Show Graphical View
                  </button>
                )}
              </div>

              {this.state.displayGraph ? (
                this.state.countrySelected.country &&
                this.state.countrySelected.historicalData ? (
                  <div
                    style={{ width: window.innerWidth - 8 }}
                    className={"gContainer"}
                  >
                    <Chart
                      country={this.state.countrySelected.country}
                      historicalData={
                        this.state.countrySelected.historicalData.cases
                      }
                      parameter={"Cases"}
                      color={"rgba(35, 52, 239, 1)"}
                    />
                    <Chart
                      country={this.state.countrySelected.country}
                      historicalData={
                        this.state.countrySelected.historicalData.deaths
                      }
                      parameter={"Deaths"}
                      color={"red"}
                    />
                  </div>
                ) : (
                  <div className={"graphPlaceHolder"}>
                    {this.state.historicalDataFetched ? `Awaiting ` : `No `}
                    Graphical Information
                  </div>
                )
              ) : null}
            </div>

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
                  <th className={"Col"}>Cases(+new)</th>
                  <th className={"Col"}>Active </th>
                  <th className={"Col"}>Deaths(+new)</th>
                  <th className={"Col"}>Tests</th>
                </tr>
              </tbody>

              <div
                style={{
                  height: this.scrollHeightSetter()
                }}
                className={"Scroll"}
              >
                {filteredData.map((el, index) => (
                  <TableRows
                    key={index}
                    row={el}
                    index={index}
                    updateGraph={this.updateGraph}
                  />
                ))}
              </div>
            </table>
          </div>
        </div>
      </div>
    );
  }
}
