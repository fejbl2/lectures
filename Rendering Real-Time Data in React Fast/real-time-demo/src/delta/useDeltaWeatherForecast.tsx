import { useEffect, useRef, useState } from "react";
import type { ForecastItem, Message } from "../common";
import type { UseForecastResult } from "../Forecast";
import { getForecastData, subscribeForeast } from "../jointProducer";

let bytes = 0;

const parseDelta = (data: string): Message => {
  bytes += data.length;
  return JSON.parse(data) as Message;
};

export default function useDeltaWeatherForecast(): UseForecastResult {
  const [data, setData] = useState<ForecastItem[]>([]);
  const cleanupRef = useRef<() => void | null>(null);

  useEffect(() => {
    let mounted = true;

    async function initialize() {
      const initialData = await getForecastData();
      if (!mounted) return;

      bytes += initialData.length;
      setData(JSON.parse(initialData) as ForecastItem[]);

      // FIRST need to get the snapshot, THEN can subscribe to deltas
      //  - a better design would not put this logic on the client - the server sends the snapshot first, then deltas
      //  - because this way, the client can miss some deltas between getting the snapshot and subscribing to deltas
      cleanupRef.current = subscribeForeast({
        type: "delta",
        callback: (delta) => {
          const parsedDelta = parseDelta(delta);

          setData((prevData) => {
            return prevData.map(
              (item) =>
                item.city === parsedDelta.city
                  ? { ...item, temperature: parsedDelta.temperature }
                  : item, // this line is crucial ... preserves the refence for unchanged items
            );
          });
        },
      });
    }

    initialize();

    return () => {
      mounted = false;
      if (cleanupRef.current) {
        cleanupRef.current();
      }
    };
  }, []);

  return { bytes, items: data };
}
