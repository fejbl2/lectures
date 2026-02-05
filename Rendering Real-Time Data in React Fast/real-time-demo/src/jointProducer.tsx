import {
  createInitialForecast,
  makeSubscribeForeast,
  randomTemperature,
  UPDATE_INTERVAL_MS,
  type ForecastItem,
  type Message,
  type Subscriber,
} from "./common";

const data: ForecastItem[] = createInitialForecast();
let latestData = JSON.stringify(data);

// Producer control state
let intervalId: ReturnType<typeof setInterval> | null = null;
let currentInterval = UPDATE_INTERVAL_MS;
let isRunning = false;

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

// Producer control functions
export const startProducer = () => {
  if (!isRunning) {
    intervalId = setInterval(updateForecast, currentInterval);
    isRunning = true;
  }
};

export const stopProducer = () => {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
    isRunning = false;
  }
};

export const setUpdateInterval = (newInterval: number) => {
  currentInterval = newInterval;
  if (isRunning) {
    stopProducer();
    startProducer();
  }
};

export const isProducerRunning = () => isRunning;
export const getCurrentInterval = () => currentInterval;

const subscribers: Subscriber[] = [];

export const subscribeForeast = makeSubscribeForeast(subscribers);

export const getForecastData = async (): Promise<string> => {
  return latestData;
};

export const getForecastDataSync = (): string => {
  return latestData;
};
