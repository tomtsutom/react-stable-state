# react-stable-state

A simple React Hooks for stable useState.

This module was designed with the use case of saving data after a certain amount of time has elapsed after editing. By using `useStableState` instead of `useState`, the number of times to process can be greatly reduced.

You can check a demo page here.

## Installation

```bash
yarn add react-stable-state
```

or

```bash
npm i --save react-stable-state
```

## Example


```tsx
import { useEffect } from "react";
import { useStableState } from "react-stable-state";

const App = () => {
  const {
    state: value,
    stableState: stableValue,
    setState: setValue,
  } = useStableState<string>({initialState: localStorage.getItem("key") || ""});

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
        onChange={(e) => { e.preventDefault(); setValue(e.target.value) }}
        >
        </input>
    </div>
  )
}
export default App;
```
