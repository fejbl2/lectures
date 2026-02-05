import { useEffect, useState } from "react";
import type { ForecastItem } from "../common";
import type { UseForecastResult } from "../Forecast";
import { getForecastDataSync, subscribeForeast } from "../jointProducer";

let bytes = 0;

const parseForecast = (data: string): ForecastItem[] => {
  bytes += data.length;
  return JSON.parse(data) as ForecastItem[];
};

export default function useSimpleOptimizedWeatherForecast(): UseForecastResult {
  const [data, setData] = useState<ForecastItem[]>(
    () => parseForecast(getForecastDataSync()), // 'sync' is a little hack to make code of this component simpler
  );

  useEffect(() => {
    const unsubscribe = subscribeForeast({
      type: "simple",
      callback: (newData) => {
        const parsed = parseForecast(newData); // Called only once now

        setData((prev) => {
          // Deep compare each item, if same, do not change the reference
          const next = prev.map((item, index) => {
            const newItem = parsed[index];

            if (
              item.city === newItem.city &&
              item.temperature === newItem.temperature
            ) {
              return item; // preserve reference
            } else {
              return newItem; // new reference
            }
          });

          return next;
        });
      },
    });

    return unsubscribe;
  }, []);

  return { bytes, items: data };
}
