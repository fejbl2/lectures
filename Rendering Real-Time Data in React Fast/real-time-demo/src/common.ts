import { cityBank } from "./cityBank";

export type ForecastItem = { city: string; temperature: number };
export type Message = { city: string; temperature: number };

export type CallbackFn = (data: string) => void;
export type Subsriber = {
  type: "delta" | "simple";
  callback: CallbackFn;
};
export type UnsubscribeFn = () => void;

export const NUM_CITIES = 30;
export const UPDATE_INTERVAL_MS = 25;

export const cities = cityBank.slice(0, NUM_CITIES);

export const randomTemperature = () => Math.floor(Math.random() * 30);

export const createInitialForecast = (): ForecastItem[] => {
  return cities.map((city) => ({ city, temperature: randomTemperature() }));
};

export const makeSubscribeForeast =
  (subscribers: Subsriber[]) =>
  (subscriber: Subsriber): UnsubscribeFn => {
    subscribers.push(subscriber);

    return () => {
      const index = subscribers.indexOf(subscriber);
      if (index !== -1) {
        subscribers.splice(index, 1);
      }
    };
  };
