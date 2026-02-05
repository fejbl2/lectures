import { useState } from "react";
import {
  getCurrentInterval,
  isProducerRunning,
  setUpdateInterval,
  startProducer,
  stopProducer,
} from "./jointProducer";

function ProducerControls() {
  const [, setForceRerender] = useState(0);

  const onStateChange = () => {
    setForceRerender((prev) => prev + 1);
  };

  // Get current values directly from jointProducer
  const isPlaying = isProducerRunning();
  const updateInterval = getCurrentInterval();
  const changesPerSecond = Math.round(1000 / updateInterval);

  const handlePlayPause = () => {
    if (isPlaying) {
      stopProducer();
    } else {
      startProducer();
    }
    onStateChange();
  };

  const handleSpeedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const sliderValue = parseInt(event.target.value);
    // Invert the slider: higher slider value = lower interval = faster speed
    const newInterval = 1010 - sliderValue;
    setUpdateInterval(newInterval);
    onStateChange();
  };

  return (
    <div
      className="controls-container"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "20px",
        marginBottom: "20px",
        padding: "15px",
        backgroundColor: "#f5f5f5",
        borderRadius: "8px",
        border: "1px solid #ddd",
      }}
    >
      <button
        onClick={handlePlayPause}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: isPlaying ? "#ff4444" : "#44aa44",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          minWidth: "80px",
        }}
      >
        {isPlaying ? "⏸️ Stop" : "▶️ Play"}
      </button>

      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <label htmlFor="speed-slider" style={{ fontWeight: "bold" }}>
          Speed:
        </label>
        <input
          id="speed-slider"
          type="range"
          min="10"
          max="1000"
          step="10"
          value={1010 - updateInterval}
          onChange={handleSpeedChange}
          style={{ width: "200px" }}
        />
        <span style={{ minWidth: "60px", fontSize: "14px" }}>
          {updateInterval}ms
        </span>
      </div>

      <div
        style={{
          padding: "8px 12px",
          backgroundColor: isPlaying ? "#e8f5e8" : "#f0f0f0",
          borderRadius: "5px",
          border: `1px solid ${isPlaying ? "#44aa44" : "#ccc"}`,
          fontSize: "14px",
          fontWeight: "bold",
          color: isPlaying ? "#2d5a2d" : "#666",
        }}
      >
        {isPlaying
          ? `Generating ${changesPerSecond} changes per second`
          : "Data generation stopped"}
      </div>
    </div>
  );
}

export default ProducerControls;
