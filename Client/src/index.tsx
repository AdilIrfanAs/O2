import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import SeedApp from "./Seed-App";
import "react-toastify/dist/ReactToastify.css";

ReactDOM.render(
  <React.StrictMode>
    {/* <App /> */}
    <SeedApp />
  </React.StrictMode>,
  document.getElementById("root")
);
