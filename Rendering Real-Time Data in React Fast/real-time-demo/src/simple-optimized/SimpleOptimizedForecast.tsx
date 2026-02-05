import makeForecast from "../Forecast";
import useSimpleOptimizedWeatherForecast from "./useSimpleOptimizedWeatherForecast";

const SimpleOptimizedForecast = makeForecast({
  name: "Simple Optimized Forecast",
  useForecast: useSimpleOptimizedWeatherForecast,
});

export default SimpleOptimizedForecast;
