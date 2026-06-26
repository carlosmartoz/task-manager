import "@/src/styles/globals.css";
import { StrictMode } from "react";
import { Page } from "@/src/app/page";
import { createRoot } from "react-dom/client";

localStorage.removeItem("taskmanager.core.v1");

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Page />
  </StrictMode>,
);
