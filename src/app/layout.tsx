import "@/src/styles/globals.css";
import { StrictMode } from "react";
import { Page } from "@/src/app/page";
import { createRoot } from "react-dom/client";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Page />
  </StrictMode>,
);
