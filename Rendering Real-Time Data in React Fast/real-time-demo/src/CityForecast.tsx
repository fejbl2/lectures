import { memo } from "react";
import type { ForecastItem } from "./common";

const CityForecast = ({
  item,
  onRender,
}: {
  item: ForecastItem;
  onRender: () => void;
}) => {
  onRender();

  return (
    <div className="city-card">
      <div className="city-name">{item.city}</div>
      <div className="city-temperature">{item.temperature}°C</div>
    </div>
  );
};

export default memo(CityForecast);
