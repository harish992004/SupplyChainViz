import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Add the Leaflet CSS
const linkElement = document.createElement("link");
linkElement.rel = "stylesheet";
linkElement.href = "https://unpkg.com/leaflet@1.9.3/dist/leaflet.css";
linkElement.integrity = "sha256-kLaT2GOSpHechhsozzB+flnD+zUyjE2LlfWPgU04xyI=";
linkElement.crossOrigin = "";
document.head.appendChild(linkElement);

// Add a title
const titleElement = document.createElement("title");
titleElement.textContent = "Supply Chain Visualization";
document.head.appendChild(titleElement);

createRoot(document.getElementById("root")!).render(<App />);
