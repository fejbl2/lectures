import { useEffect, useRef, useState } from "react";
import type { ForecastItem, Message } from "../common";
import { getForecastData, subscribeForeast } from "../jointProducer";

const parseDelta = (data: string): Message => {
  return JSON.parse(data) as Message;
};

export default function useDeltaWeatherForecast() {
  const [data, setData] = useState<ForecastItem[]>([]);
  const cleanupRef = useRef<() => void | null>(null);

  useEffect(() => {
    let mounted = true;

    async function initialize() {
      const initialData = await getForecastData();
      if (!mounted) return;

      setData(JSON.parse(initialData) as ForecastItem[]);

      // FIRST need to get the snapshot, THEN can subscribe to deltas
      //  - a better design would not put this logic on the client - the server sends the snapshot first, then deltas
      cleanupRef.current = subscribeForeast({
        type: "delta",
        callback: (delta) => {
          const parsedDelta = parseDelta(delta);

          setData((prevData) => {
            return prevData.map(
              (item) =>
                item.city === parsedDelta.city
                  ? { ...item, temperature: parsedDelta.temperature }
                  : item // this line is crucial ... preserves the refence for unchanged items
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

  return data;
}
