# react-stable-state

[![ci](https://github.com/tomtsutom/react-stable-state/actions/workflows/ci.yaml/badge.svg)](https://github.com/tomtsutom/react-stable-state/actions/workflows/ci.yaml)
[![Coverage Status](https://tomtsutom.github.io/react-stable-state/coverage-badges.svg)](https://tomtsutom.github.io/react-stable-state/coverage-badges.svg)

A simple React Hooks for stable useState.

This module was designed with the use case of saving data after a certain amount of time has elapsed after editing. By using `useStableState` instead of `useState`, the number of times to process can be greatly reduced.

You can check a demo page [here](https://tsutomu-ikeda.github.io/react-stable-state-demo).

## Installation

```bash
yarn add react-stable-state
```

or

```bash
npm i --save react-stable-state
```

## Example

Example of saving to Local Storage after the value is changed and a certain period of time has elapsed.

```tsx
import { useEffect } from "react";
import { useStableState } from "react-stable-state";

const App = () => {
  const [value, stableValue, setValue] = useStableState<string>({
    initialState: localStorage.getItem("key") || "",
  });

  useEffect(() => {
    console.log("stable value has changed!");
    localStorage.setItem("key", stableValue);
  }, [stableValue]);

  return (
    <div className="App" id="app">
      <input
        type="text"
        id="text-input"
        value={value}
        onChange={(e) => {
          e.preventDefault();
          setValue(e.target.value);
        }}
      ></input>
    </div>
  );
};
export default App;
```

You can also store values to server by calling the Fetch API in the `onStableStateChanged` callback function.
`onStableStateChanged` callback would not invoked when the state is changed by the `load` function

```tsx
import { useStableState } from "react-stable-state";

const App = () => {
  const [value, stableValue, setValue] = useStableState<string>({
    initialState: "",
    load: () =>
      fetch("/data_store").then((resp) => resp.text()),
    onStableStateChanged: () =>
      fetch("/data_store", {
        method: "POST",
        body: JSON.stringify({ value: stableValue }),
        headers: {
          "Content-Type": "application/json",
        },
      }).then(),
  });

  return (
    <div className="App" id="app">
      <input
        type="text"
        id="text-input"
        value={value}
        onChange={(e) => {
          e.preventDefault();
          setValue(e.target.value);
        }}
      ></input>
    </div>
  );
};
export default App;
```
