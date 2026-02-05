import { useCallback, useRef } from "react";
import CityForecast from "./CityForecast";
import type { ForecastItem } from "./common";

export type UseForecastResult = { items: ForecastItem[]; bytes: number };

const makeForecast =
  ({
    name,
    useForecast,
  }: {
    useForecast: () => UseForecastResult;
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
            Renders (lagged by one): {renderCount.current}
          </div>
          <div className="render-count-badge">
            Transferred total {data.bytes} bytes
          </div>
        </div>
        <div className="cities-grid">
          {data.items.map((item) => (
            <CityForecast key={item.city} item={item} onRender={onRender} />
          ))}
        </div>
      </div>
    );
  };

export default makeForecast;
