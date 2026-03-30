import React, { Component } from "react";
import Home from "./Homes";
import About from "./About";
import Contact from "./Contact";

class App extends Component {
  render() {
    return (
      <div>
        <Home />
        <About />
        <Contact />
      </div>
    );
  }
}

export default App;

