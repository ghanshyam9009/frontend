import React from "react";
import Navbar from "./Components/Navbar/Navbar";
import Routes from "./Routes/Routes";

const App = () => {
  return (
    <div className="appShell">
      <Navbar />
      <Routes />
    </div>
  );
};

export default App;