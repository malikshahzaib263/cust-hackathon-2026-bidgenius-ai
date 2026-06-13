import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { TenderProvider } from "./context/TenderContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <TenderProvider>
        <App />
      </TenderProvider>
    </BrowserRouter>
  </React.StrictMode>
);
