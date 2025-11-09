import makeForecast from "../Forecast";
import useDeltaWeatherForecast from "./useDeltaWeatherForecast";

const DeltaForecast = makeForecast({
  name: "Delta Forecast",
  useForecast: useDeltaWeatherForecast,
});

export default DeltaForecast;
