import "@/src/styles/globals.css";
import { StrictMode } from "react";
import { Page } from "@/src/app/page";
import { createRoot } from "react-dom/client";

// One-time cleanup: drop the old combined store key now that each feature
// persists separately (taskmanager.groups.v1 / taskmanager.dailies.v1).
localStorage.removeItem("taskmanager.core.v1");

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Page />
  </StrictMode>,
);
