import React, { Component } from "react";
import "../Covid.css";

class Footer extends Component {
  render() {
    return (
      <footer>
        <nav>
          <div className="tooltip">
            Contact Team
            <span className="tooltiptext">mstrfpts@gmail.com</span>
          </div>
        </nav>
      </footer>
    );
  }
}

export default Footer;
