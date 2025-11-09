import { useEffect, useState } from "react";
import type { ForecastItem } from "../common";
import { subscribeForeast } from "../jointProducer";

const parseForecast = (data: string): ForecastItem[] => {
  return JSON.parse(data) as ForecastItem[];
};

export default function useSimpleWeatherForecast() {
  const [data, setData] = useState<ForecastItem[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeForeast({
      type: "simple",
      callback: (newData) => setData(parseForecast(newData)),
    });
    return unsubscribe;
  }, []);

  return data;
}
