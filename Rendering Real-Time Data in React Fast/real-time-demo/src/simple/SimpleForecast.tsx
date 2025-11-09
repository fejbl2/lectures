import makeForecast from "../Forecast";
import useSimpleWeatherForecast from "./useSimpleWeatherForecast";

const SimpleForecast = makeForecast({
  name: "Simple Forecast",
  useForecast: useSimpleWeatherForecast,
});

export default SimpleForecast;
