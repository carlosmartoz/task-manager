import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AppProvider } from "./context/AppContext.tsx";
import { ConfirmProvider } from "./context/ConfirmProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ConfirmProvider>
      <AppProvider>
        <App />
      </AppProvider>
    </ConfirmProvider>
  </StrictMode>
);
