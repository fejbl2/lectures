import "./App.css";
import DeltaForecast from "./delta/DeltaForecast";
import ProducerControls from "./ProducerControls";
import SimpleOptimizedForecast from "./simple-optimized/SimpleOptimizedForecast";
import SimpleForecast from "./simple/SimpleForecast";

function App() {
  return (
    <div className="app-container">
      <h1 className="app-title">Real-Time Weather Forecast</h1>

      <ProducerControls />

      <div className="forecast-grid">
        <SimpleForecast />
        <SimpleOptimizedForecast />
        <DeltaForecast />
      </div>
    </div>
  );
}

export default App;
