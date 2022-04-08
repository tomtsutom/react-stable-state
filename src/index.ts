import { useState, useEffect, useRef } from "react";

function useStableState<T>(options: { initialState: T; delay?: number }) {
  const [state, setState] = useState(options.initialState);
  const [stableState, setStableState] = useState(options.initialState);
  const lastEditTimeRef = useRef(new Date());
  const [editCount, setEditCount] = useState(0);
  const [saveTrigger, setSaveTrigger] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [delay, setDelay] = useState(options.delay || 1000);

  useEffect(() => {
    if (editCount > 0) {
      setIsEditing(true);
    }
    lastEditTimeRef.current = new Date();
    setEditCount(editCount + 1);
  }, [state, setEditCount]);

  useEffect(() => {
    setTimeout(() => {
      if (
        new Date().getTime() - lastEditTimeRef.current.getTime() >=
        delay
      ) {
        setSaveTrigger(true);
      }
    }, delay);
  }, [editCount, setEditCount, setSaveTrigger]);

  useEffect(() => {
    if (saveTrigger) {
      setStableState(state);
      setSaveTrigger(false);
      setIsEditing(false);
    }
  }, [saveTrigger]);

  return { state, stableState, setState, isEditing, delay, setDelay } as const;
}

export { useStableState };
export default { useStableState };
