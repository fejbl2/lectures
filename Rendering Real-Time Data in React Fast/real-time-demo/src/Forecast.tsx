import { useCallback, useRef } from "react";
import CityForecast from "./CityForecast";
import type { ForecastItem } from "./common";

const makeForecast =
  ({
    name,
    useForecast,
  }: {
    useForecast: () => ForecastItem[];
    name: string;
  }) =>
  () => {
    const data = useForecast();
    const renderCount = useRef(0);
    const onRender = useCallback(() => (renderCount.current += 1), []);

    return (
      <div className="forecast-column">
        <div className="forecast-header">
          <h2 className="forecast-title">{name}</h2>
          <div className="render-count-badge">
            Renders: {renderCount.current}
          </div>
        </div>
        <div className="cities-grid">
          {data.map((item) => (
            <CityForecast key={item.city} item={item} onRender={onRender} />
          ))}
        </div>
      </div>
    );
  };

export default makeForecast;
