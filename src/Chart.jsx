import React, { Component } from "react";
import { Line, Bar } from "react-chartjs-2";
import "./Chart.css";

export default class Chart extends Component {
  render() {
    let data = {
      labels: Object.keys(this.props.historicalData),
      datasets: [
        {
          label: `${this.props.country} ${this.props.parameter}`,
          fill: true,
          lineTension: 0.1,
          backgroundColor: this.props.color, //"rgba(75,192,192,0.4)",
          borderColor: this.props.color, //"rgba(35, 52, 239, 1)", //"rgba(75,192,192,1)",
          borderCapStyle: "butt",
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: "miter",
          //pointBorderColor: "rgba(75,192,192,1)",
          pointBackgroundColor: "#fff",
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          //pointHoverBackgroundColor: "rgba(75,192,192,1)",
          //pointHoverBorderColor: "rgba(220,220,220,1)",
          //pointHoverBorderWidth: 2,
          pointRadius: 1,
          //pointHitRadius: 10,
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
