import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { setBaseUrl } from "@workspace/api-client-react";

// Set the base URL for the API client
setBaseUrl("/api");

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);