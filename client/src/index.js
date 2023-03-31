import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { IconContext } from "react-icons";
import { Provider } from "react-redux";
import store from "./store";
import { GoogleOAuthProvider } from "@react-oauth/google";

import { ThemeProvider } from "@material-tailwind/react";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <GoogleOAuthProvider clientId="216168406592-64kfuc404f6apspc4l9pjo9ub6b1j9fq.apps.googleusercontent.com">
          <IconContext.Provider value={{ color: "black", size: "1.5em", className: "" }}>
            <App />
          </IconContext.Provider>
        </GoogleOAuthProvider>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);
