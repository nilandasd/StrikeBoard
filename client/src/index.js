import React from "react";
import ReactDOM from "react-dom";
import App from "./routing/App";

import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap-icons/font/bootstrap-icons.css';
import WaveLinesImage from "../WaveLine.svg";

document.body.style.background = `url("${WaveLinesImage}")`;
document.body.style.backgroundSize = "100vw 100vh";

const Root = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

ReactDOM.render(Root, document.getElementById("root"));
