import {
  createInitialForecast,
  makeSubscribeForeast,
  randomTemperature,
  UPDATE_INTERVAL_MS,
  type ForecastItem,
  type Subscriber,
} from "../common";

const data: ForecastItem[] = createInitialForecast();
let latestData = JSON.stringify(data);

const updateForecast = () => {
  // takes a random item from data and updates its temperature
  const index = Math.floor(Math.random() * data.length);
  data[index].temperature = randomTemperature();

  // notify subscribers
  latestData = JSON.stringify(data);
  subscribers.forEach((subscriber) => subscriber.callback(latestData));
};

setInterval(updateForecast, UPDATE_INTERVAL_MS);

const subscribers: Subscriber[] = [];

export const subscribeForeast = makeSubscribeForeast(subscribers);

export const getForecastData = async (): Promise<string> => {
  return latestData;
};
