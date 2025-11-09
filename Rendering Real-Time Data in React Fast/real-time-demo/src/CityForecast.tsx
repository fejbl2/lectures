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

// Question for audience: Will rendering this instead of CityForecast help with decreasing the render count?
export default memo(CityForecast);
// export default CityForecast;
