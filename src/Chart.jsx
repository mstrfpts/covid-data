import React, { Component } from "react";
import { Bar } from "react-chartjs-2";
import "./Chart.css";

export default class Chart extends Component {
  render() {
    let data = {
      labels: Object.keys(this.props.historicalData),
      datasets: [
        {
          label: `${this.props.country} ${this.props.parameter}`,
          fill: true,
          backgroundColor: this.props.color,
          borderColor: this.props.color,
          borderCapStyle: "butt",
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: "miter",

          pointBackgroundColor: "#fff",
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointRadius: 1,

          data: Object.values(this.props.historicalData)
        }
      ]
    };
    let options = {
      tooltips: {
        callbacks: {
          label: function(tooltipItem, data) {
            var value = data.datasets[0].data[tooltipItem.index];
            value = nFormatter(value);
            return value;
          }
        }
      },
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
              userCallback: function(value, index, values) {
                // Convert the number to a string and splite the string every 3 charaters from the end
                value = nFormatter(value);
                return value;
              }
            }
          }
        ],
        xAxes: [
          {
            ticks: {}
          }
        ]
      }
    };

    function nFormatter(num) {
      if (num >= 1000000000) {
        return (num / 1000000000).toFixed(1).replace(/\.0$/, "") + "B";
      }
      if (num >= 1000000) {
        return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
      }
      if (num >= 1000) {
        return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
      }
      return num;
    }

    return (
      <div>
        <div className={"graphContainer"}>
          {/*<Line options={options} data={data} height={2} width={2}></Line>*/}
          <Bar options={options} data={data} height={2} width={2}></Bar>
        </div>
      </div>
    );
  }
}
