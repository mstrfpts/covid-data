import React, { Component } from "react";
import "./Covid.css";
import _ from "lodash";
import Table from "./Components/Table";
import Chart from "./Components/Chart";
import formattedDate from "./Components/Date";

import { initGA, PageView } from "./Tracking";

export default class Covid extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
      filteredData: [],
      filterValue: "",
      daysOfData: 30,
      graphData: "Cases",
      countrySelected: {},
      displayGraph: true,
      historicalDataFetched: true
    };
  }

  componentDidMount() {
    document.title = "Coronavirus case count";

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
    this.setState({ displayGraph: !this.state.displayGraph });
  };

  scrollHeightSetter = () => {
    let scrollHeight = this.state.displayGraph
      ? window.innerHeight - 300
      : window.innerHeight - 220;

    return scrollHeight;
  };

  updateCountryHistoricalData = countryData => {
    this.setState(
      {
        countrySelected: {
          ...this.state.countrySelected,
          historicalData: countryData
        }
      },
      () => {
        this.getDailyCount();
      }
    );
  };

  updateCountryData = countryClicked => {
    let countriesDataArray = this.state.data;
    let selectedCountryData = countriesDataArray.find(
      element => element.country === countryClicked
    );

    this.setState({
      countrySelected: {
        country: countryClicked,
        countryData: selectedCountryData
      }
    });
  };

  updateGraph = countryClicked => {
    let { daysOfData } = this.state;
    let countrySelectedHistoricalData;

    this.setState(this.updateCountryData(countryClicked), () => {
      fetch(
        `https://corona.lmao.ninja/v2/historical/${this.state.countrySelected.country}?lastdays=${daysOfData}`
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
    });
  };

  getDailyCount = () => {
    let historicalDataDailyCount = { cases: {}, deaths: {} };
    let dailyCasesCountValues = [];
    let dailyDeathsCountValues = [];
    let historicalDataDailyCasesCalculated, historicalDataDailyDeathsCalculated;
    let historicalDataDailyCasesKeys = Object.keys(
      this.state.countrySelected.historicalData.cases
    );
    let historicalDataDailyDeathsKeys = Object.keys(
      this.state.countrySelected.historicalData.deaths
    );
    let historicalDataCasesValues = Object.values(
      this.state.countrySelected.historicalData.cases
    );
    let historicalDataDeathsValues = Object.values(
      this.state.countrySelected.historicalData.deaths
    );

    for (let i = 0; i < historicalDataCasesValues.length - 1; i++) {
      if (historicalDataCasesValues[i + 1] - historicalDataCasesValues[i] < 0) {
        historicalDataDailyCasesCalculated = historicalDataCasesValues[i - 1]
          ? historicalDataCasesValues[i] - historicalDataCasesValues[i - 1]
          : 0;
      } else {
        historicalDataDailyCasesCalculated =
          historicalDataCasesValues[i + 1] - historicalDataCasesValues[i];
      }
      //dailyCasesCountValues.push(historicalDataDailyCasesCalculated);
      historicalDataDailyCount.cases[
        historicalDataDailyCasesKeys[i + 1]
      ] = historicalDataDailyCasesCalculated;
    }

    for (let i = 0; i < historicalDataDeathsValues.length - 1; i++) {
      if (
        historicalDataDeathsValues[i + 1] - historicalDataDeathsValues[i] <
        0
      ) {
        historicalDataDailyDeathsCalculated = historicalDataDeathsValues[i - 1]
          ? historicalDataDeathsValues[i] - historicalDataDeathsValues[i - 1]
          : 0;
      } else {
        historicalDataDailyDeathsCalculated =
          historicalDataDeathsValues[i + 1] - historicalDataDeathsValues[i];
      }
      //dailyDeathsCountValues.push(historicalDataDailyDeathsCalculated);
      historicalDataDailyCount.deaths[
        historicalDataDailyDeathsKeys[i + 1]
      ] = historicalDataDailyDeathsCalculated;
    }

    /*Adding todays Live Data to historical data*/
    let historicalData = this.state.countrySelected.historicalData;
    let del = formattedDate(this.state.daysOfData * -1);
    delete historicalData.cases[del];
    delete historicalData.deaths[del];

    historicalData.cases[
      formattedDate()
    ] = this.state.countrySelected.countryData.cases;

    historicalDataDailyCount.cases[
      formattedDate()
    ] = this.state.countrySelected.countryData.todayCases;

    historicalData.deaths[
      formattedDate()
    ] = this.state.countrySelected.countryData.deaths;

    historicalDataDailyCount.deaths[
      formattedDate()
    ] = this.state.countrySelected.countryData.todayDeaths;

    this.setState({
      countrySelected: {
        ...this.state.countrySelected,
        historicalDataDailyCount: historicalDataDailyCount
      }
    });
  };

  daysOfDataChangeHandler = e => {
    this.setState({ daysOfData: parseInt(e.target.value) }, () => {
      this.updateGraph(this.state.countrySelected.country);
    });
  };

  graphDataChangeHandler = e => {
    this.setState({ graphData: e.target.value }, () => {
      this.updateGraph(this.state.countrySelected.country);
    });
  };

  render() {
    const { filteredData, filterValue, graphData } = this.state;
    let graphDaysOptions = [
      1,
      2,
      3,
      4,
      5,
      10,
      20,
      30,
      40,
      50,
      60,
      70,
      80,
      90,
      100
    ];
    let graphDataOptions = ["Cases", "Deaths"];
    let tableColumns = [
      "Country",
      "Cases(+new)",
      "Active",
      "Deaths(+new)",
      "Tests"
    ];

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
                this.state.countrySelected.historicalData &&
                this.state.countrySelected.historicalDataDailyCount ? (
                  <div
                    style={{ width: window.innerWidth - 8 }}
                    className={"gContainer"}
                  >
                    <Chart
                      country={this.state.countrySelected.country}
                      historicalData={
                        graphData === "Cases"
                          ? this.state.countrySelected.historicalDataDailyCount
                              .cases
                          : this.state.countrySelected.historicalDataDailyCount
                              .deaths
                      }
                      parameter={`Daily ${graphData}`}
                      color={graphData === "Cases" ? "blue" : "red"}
                    />
                    <Chart
                      country={this.state.countrySelected.country}
                      historicalData={
                        graphData === "Cases"
                          ? this.state.countrySelected.historicalData.cases
                          : this.state.countrySelected.historicalData.deaths
                      }
                      parameter={`Total ${graphData}`}
                      color={graphData === "Cases" ? "blue" : "red"}
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
            {this.state.displayGraph ? (
              <div className={"daysDropDown"}>
                <label className={"graphDropwdownLabel"}>Graph data on:</label>
                <select
                  className={"graphDropdown"}
                  id="graphData"
                  onChange={this.graphDataChangeHandler}
                  defaultValue={this.state.graphData}
                >
                  {_.map(graphDataOptions, (value, index) => {
                    return (
                      <option key={index} value={value}>
                        {value}
                      </option>
                    );
                  })}
                </select>
                <label>Days:</label>
                <select
                  id="graphDays"
                  onChange={this.daysOfDataChangeHandler}
                  defaultValue={this.state.daysOfData}
                >
                  {_.map(graphDaysOptions, (value, index) => {
                    return (
                      <option key={index} value={value}>
                        {value}
                      </option>
                    );
                  })}
                </select>
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

            <Table
              columns={tableColumns}
              heightSetter={this.scrollHeightSetter}
              filteredData={filteredData}
              updateGraph={this.updateGraph}
            />
          </div>
        </div>
      </div>
    );
  }
}
