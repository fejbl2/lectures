import {
  createInitialForecast,
  makeSubscribeForeast,
  randomTemperature,
  UPDATE_INTERVAL_MS,
  type ForecastItem,
  type Message,
  type Subscriber,
} from "../common";

const data: ForecastItem[] = createInitialForecast();
let latestData = JSON.stringify(data);
let latestDataUpToDate = true;

const updateForecast = () => {
  // takes a random item from data and updates its temperature
  const index = Math.floor(Math.random() * data.length);
  data[index].temperature = randomTemperature();
  latestDataUpToDate = false;

  // notify subscribers - send them a delta messsage
  const delta = JSON.stringify({
    city: data[index].city,
    temperature: data[index].temperature,
  } satisfies Message);

  subscribers.forEach((subscriber) => subscriber.callback(delta));
};

setInterval(updateForecast, UPDATE_INTERVAL_MS);

const subscribers: Subscriber[] = [];

export const subscribeForeast = makeSubscribeForeast(subscribers);

export const getForecastData = async (): Promise<string> => {
  if (!latestDataUpToDate) {
    latestData = JSON.stringify(data);
    latestDataUpToDate = true;
  }
  return latestData;
};
