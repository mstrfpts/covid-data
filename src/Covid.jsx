import React, { Component } from "react";
import "./Covid.css";
import _ from "lodash";
import TableRows from "./TableRows";
import Chart from "./Chart";
import { initGA, PageView } from "./Tracking";

export default class Covid extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
      filteredData: [],
      filterValue: "",
      daysOfData: 60,
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

    if (window.location.hostname !== "localhost") {
      initGA("UA-165250761-1");
      PageView();
    }
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
    dateString[0] =
      dateString[0].substring(0, 6) + dateString[0].split("/")[2].slice(0, 2);
    let formattedDateString = `${dateString[1]}, ${dateString[0]}`;
    return formattedDateString;
  };

  getFormattedDate(offset = 0) {
    let date = new Date();
    let calculatedDay = new Date(date);
    calculatedDay.setDate(calculatedDay.getDate() - offset);
    let dateString = (
      new Intl.DateTimeFormat("en-US").format(calculatedDay) + ""
    ).slice(0, 6);
    return dateString;
  }

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
    this.setState({ displayGraph: !this.state.displayGraph });
  };

  scrollHeightSetter = () => {
    let scrollHeight = this.state.displayGraph
      ? window.innerHeight - 460
      : window.innerHeight - 220;

    return scrollHeight;
  };

  updateCountryHistoricalData = countryData => {
    let oneDayPriorDate = this.getFormattedDate(1);
    let twoDaysPriorDate = this.getFormattedDate(2);

    console.log("derd, yest date", oneDayPriorDate);
    console.log("derd, yest date", twoDaysPriorDate);
    console.log("derd 1", countryData.cases);
    console.log("derd 1", countryData.cases[oneDayPriorDate]);
    console.log("derd 1", countryData.cases[twoDaysPriorDate]);
    console.log(
      "derd, hist data",
      _.find(Object.keys(countryData.cases), key => {
        return key === oneDayPriorDate;
      })
    );

    let oneDayPriorSelectedCountryCases = countryData.cases[oneDayPriorDate];
    let oneDayPriorSelectedCountryDeaths = countryData.deaths[oneDayPriorDate];

    let twoDaysPriorSelectedCountryCases = countryData.cases[twoDaysPriorDate];
    let twoDaysPriorSelectedCountryDeaths =
      countryData.deaths[twoDaysPriorDate];

    /*let yesterdaySelectedCountryData = _.find(
      this.state.countrySelectedHistoricalData
      data => {
        return data.country === this.state.countrySelected.country;
      }
    );*/
    let todaySelectedCountryData = _.find(this.state.data, data => {
      return data.country === this.state.countrySelected.country;
    });

    //console.log("derd, todaySelectdCountry", yesterdaySelectedCountryData);
    console.log("derd, todaySelectdCountry", todaySelectedCountryData);

    let countIncrement = {
      cases: oneDayPriorSelectedCountryCases > twoDaysPriorSelectedCountryCases,
      deaths:
        oneDayPriorSelectedCountryDeaths > twoDaysPriorSelectedCountryDeaths
    };

    countIncrement
      ? countIncrement.cases
        ? console.log("derd, state, count", countIncrement)
        : console.log("derd, no increment")
      : console.log("no count");

    this.setState(
      {
        countrySelected: {
          ...this.state.countrySelected,
          historicalData: countryData,
          countIncrement: countIncrement
        }
      },
      () => console.log("state", this.state)
    );
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
        fetch(
          `https://corona.lmao.ninja/v2/historical/${this.state.countrySelected.country}?lastdays=${this.state.daysOfData}`
        )
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

  daysOfDataChangeHandler = e => {
    this.setState({ daysOfData: e.target.value }, () => {
      this.updateGraph(this.state.countrySelected.country);
    });
  };

  render() {
    const { filteredData, filterValue } = this.state;
    let graphDays = [1, 2, 3, 4, 5, 10, 20, 30, 40, 50, 60, 70];

    return (
      <div className={"imageContainer"}>
        <div className={"backgroundContainer"}>
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
          <div className={"textOpacityContainer"}>
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
                    <div style={{ marginTop: 70 }}>
                      {this.state.countrySelected.countIncrement.cases ? (
                        <p>
                          <i className="arrow up"></i>
                        </p>
                      ) : (
                        <p>
                          <i className="arrow down"></i>
                        </p>
                      )}
                    </div>

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
            <div className={"daysDropDown"}>
              <label>Days:</label>
              <select
                id="graphDays"
                onChange={this.daysOfDataChangeHandler}
                defaultValue={this.state.daysOfData}
              >
                {_.map(graphDays, (value, index) => {
                  return (
                    <option key={index} value={value}>
                      {value}
                    </option>
                  );
                })}
              </select>
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
