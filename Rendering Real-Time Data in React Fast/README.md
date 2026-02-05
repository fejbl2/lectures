# About this lecture

I presented this lecture at the meetup TODO.

[Link to event](https://www.meetup.com/frontendisti/events/313093149/) (fallback [here](https://web.archive.org/web/20260205133623/https://www.meetup.com/frontendisti/events/313093149/)).

## Motivation

Sometimes, you need to consume a live stream of realtime data in a web application. Most web apps use React nowadays.
If we want to have a well performing app, how do we approach this?

## Example domain

We will be displaying real-time feed of weather forecast data for different cities.

For simplicity of this demo, the data will be in this format:

```ts
type ForecastItem = { city: string; temperature: number };
type ToBeRendered = ForecastItem[];
```

The important thing is, the rendered data is an array of objects.

## The backend

Our optimization options rely on whether we have control over the data source (producer of the data).

But even if we don't - we can write a backend service which we **have** control over, and which will
serve as a proxy with added features.

For the rest of discussion, let's assume we are the authors of both the front- and back-end.

For simplicity, our "backend" service is a "producer" ES module - but following a similar API a normal backend service would have.

## The straightforward solution

Whenever a change occurs, the server sends a new snapshot. We subscribe to this data source:

```ts
export default function useWeatherForecast() {
  const [data, setData] = useState<ForecastItem[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeForeast((newData) =>
      setData(parseForecast(newData))
    );
    return unsubscribe;
  }, []);

  return data;
}
```

And later, we render it:

```ts
export default function SimpleForecast() {
  const data = useWeatherForecast();
  const renderCount = useRef(0);
  const onRender = useCallback(() => (renderCount.current += 1), []);

  return (
    <>
      <h2>Simple Forecast</h2>
      <div>CityForecast rendered {renderCount.current} times</div>
      {data.map((item) => (
        <CityForecast key={item.city} item={item} onRender={onRender} />
      ))}
    </>
  );
}
```

How fast do you think `renderCount` grows? And what if we memoize the `CityForecast` component? 🤔

The answer is:

- every `CityForecast` rerenders when **any** other forecast changes (default React behaviour - parent changes, all children rerender)
- memoization does **not** help, because the `item` is always a different reference
  - caused by `parseForecast` function - always new objects

So, if we want a better solution, what can we do?

## The delta protocol

The fundamental issue is that we need to retain the same object **reference** for data that have not changed.

This requires the backend **not** to send the entire data snapshot when something changes. Instead, it must send only the thing which
changed - the **delta** in the data.

Both the front-end and the back-end need to understand the meaning of the delta. Since our domain is simple, and the only possible operation
on the data is _changing the temperature value_ of some existing city, the delta protocol can also be simple.

```ts
type Message = { city: string; temperature: string };
```

Note: in a real-life scenario, you would like to have two message types: _upsert_ (insert or update) and _delete_ (e.g. city removed from the forecast).
More realistically, the messages would look like:

```ts
type UpsertMessage = { key: string; payload: ForecastItem };
type DeleteMessage = { key: string };
```

## Backend for the delta protocol

maybe not needed ?

## TODO more sections

## Keywords

Websockets React Performance Rendering, Real-time data, Delta protocol
