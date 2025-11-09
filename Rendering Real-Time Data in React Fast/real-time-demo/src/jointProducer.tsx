import {
  createInitialForecast,
  makeSubscribeForeast,
  randomTemperature,
  UPDATE_INTERVAL_MS,
  type ForecastItem,
  type Message,
  type Subsriber,
} from "./common";

const data: ForecastItem[] = createInitialForecast();
let latestData = JSON.stringify(data);

const updateForecast = () => {
  // takes a random item from data and updates its temperature
  const index = Math.floor(Math.random() * data.length);
  data[index].temperature = randomTemperature();

  // notify subscribers
  latestData = JSON.stringify(data);

  const delta = JSON.stringify({
    city: data[index].city,
    temperature: data[index].temperature,
  } satisfies Message);

  subscribers.forEach(({ callback, type }) => {
    if (type === "delta") {
      callback(delta);
    } else {
      callback(latestData);
    }
  });
};

setInterval(updateForecast, UPDATE_INTERVAL_MS);

const subscribers: Subsriber[] = [];

export const subscribeForeast = makeSubscribeForeast(subscribers);

export const getForecastData = async (): Promise<string> => {
  return latestData;
};
