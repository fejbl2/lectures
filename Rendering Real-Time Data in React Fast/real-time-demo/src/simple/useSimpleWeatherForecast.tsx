import { useEffect, useState } from "react";
import type { ForecastItem } from "../common";
import type { UseForecastResult } from "../Forecast";
import { getForecastDataSync, subscribeForeast } from "../jointProducer";

let bytes = 0;

const parseForecast = (data: string): ForecastItem[] => {
  bytes += data.length;
  return JSON.parse(data) as ForecastItem[];
};

export default function useSimpleWeatherForecast(): UseForecastResult {
  const [data, setData] = useState<ForecastItem[]>(
    () => parseForecast(getForecastDataSync()), // a little hack to make code of this component simpler
  );

  useEffect(() => {
    const unsubscribe = subscribeForeast({
      type: "simple",
      callback: (newData) => setData(parseForecast(newData)),
    });
    return unsubscribe;
  }, []);

  return { items: data, bytes };
}
