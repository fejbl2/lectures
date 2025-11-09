import "./App.css";
import DeltaForecast from "./delta/DeltaForecast";
import SimpleForecast from "./simple/SimpleForecast";

function App() {
  return (
    <div className="app-container">
      <h1 className="app-title">Real-Time Weather Forecast</h1>
      <div className="forecast-grid">
        <SimpleForecast />
        <DeltaForecast />
      </div>
    </div>
  );
}

export default App;
