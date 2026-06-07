import React from "react";

import ReactDOM from "react-dom/client";

import { BrowserRouter } from "react-router-dom";

import App from "./App";

import "./index.css";

import {
  AuthProvider,
} from "./context/AuthContext";
import {
  Toaster,
} from "react-hot-toast";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <BrowserRouter>
    <AuthProvider>
      <Toaster />
      <App />
    </AuthProvider>
  </BrowserRouter>
  
);