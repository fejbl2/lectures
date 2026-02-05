import { createRoot } from "react-dom/client";
import App from "./App.tsx";

// intentionally NOT using strict mode
createRoot(document.getElementById("root")!).render(<App />);
