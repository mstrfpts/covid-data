import React, { Component } from "react";
import Covid from "./Covid";
import Footer from "./Footer/Footer.jsx";

class App extends Component {
  render() {
    return (
      <div>
        <Covid />
        <Footer />
      </div>
    );
  }
}

export default App;
