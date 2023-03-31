import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { IconContext } from "react-icons";

import { ThemeProvider } from "@material-tailwind/react";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <IconContext.Provider value={{ color: "black", size: "1.5em", className: "" }}>
        <App />
      </IconContext.Provider>
    </ThemeProvider>
  </React.StrictMode>
);
