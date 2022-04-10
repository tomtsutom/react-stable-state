import React, { useState, useEffect, useRef } from "react";

export type UseStableStateProps<T> = {
  initialState: T;
  delay?: number;
};
export type UseStableStateReturnType<T> = [
  T,
  T,
  React.Dispatch<React.SetStateAction<T>>
];
export type UseStableStateExtraReturnType<T> = {
  state: T;
  stableState: T;
  setState: React.Dispatch<React.SetStateAction<T>>;
  isEditing: boolean;
  delay: number;
  setDelay: React.Dispatch<React.SetStateAction<number>>;
};

function useStableStateExtra<T>(
  options: UseStableStateProps<T>
): UseStableStateExtraReturnType<T> {
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
      if (new Date().getTime() - lastEditTimeRef.current.getTime() >= delay) {
        setSaveTrigger(true);
      }
    }, delay);
  }, [editCount, setSaveTrigger]);

  useEffect(() => {
    if (saveTrigger) {
      setStableState(state);
      setSaveTrigger(false);
      setIsEditing(false);
    }
  }, [saveTrigger]);

  return { state, stableState, setState, isEditing, delay, setDelay } as const;
}

function useStableState<T>(
  options: UseStableStateProps<T>
): UseStableStateReturnType<T> {
  const { state, stableState, setState } = useStableStateExtra(options);

  return [state, stableState, setState];
}

export { useStableState, useStableStateExtra };
export default { useStableState, useStableStateExtra };
