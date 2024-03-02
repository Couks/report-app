import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { App } from "./app";

import { Toaster } from "sonner";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
    <Toaster richColors />
  </React.StrictMode>,
);
