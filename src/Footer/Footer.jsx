import React, { Component } from "react";
import "../Covid.css";

class Footer extends Component {
  render() {
    return (
      <footer>
        <nav>
          Created by{" "}
          <span className="tooltip">
            Derick D<span className="tooltiptext">mstrfpts@gmail.com</span>
          </span>
        </nav>
      </footer>
    );
  }
}

export default Footer;
