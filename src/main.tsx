
import { createRoot } from "react-dom/client";
import App from "./app/App";
import { SiteGridProvider } from "./app/components/SiteGrid";
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(
  <SiteGridProvider><App /></SiteGridProvider>,
);
