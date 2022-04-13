import {
  useStableState,
  useStableStateExtra,
  UseStableStateProps,
  UseStableStateParams,
  UseStableStateExtraParams,
} from "../src/index";
import {
  RenderResult,
  renderHook,
  act,
  RenderHookResult,
} from "@testing-library/react-hooks";
import React from "react";

describe("useStableStateExtra", () => {
  let result: RenderResult<UseStableStateExtraParams<string>>,
    renderHookResult: RenderHookResult<
      UseStableStateProps<string>,
      UseStableStateExtraParams<string>
    >;

  beforeEach(() => {
    renderHookResult = renderHook(() =>
      useStableStateExtra<string>({ initialState: "" })
    );

    result = renderHookResult.result;

    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("The initial condition to be correct.", () => {
    expect(result.current.state).toBe("");
    expect(result.current.stableState).toBe("");
    expect(result.current.isEditing).toBe(false);
  });

  it("State transitions should be correct when edited.", async () => {
    const initialCount = result.all.length;

    await act(async () => {
      result.current.setState("hoge");
      await renderHookResult.waitForNextUpdate();

      expect(result.current.state).toBe("hoge");
      expect(result.current.stableState).toBe("");
      expect(result.current.isEditing).toBe(true);

      jest.advanceTimersByTime(500);

      expect(result.current.state).toBe("hoge");
      expect(result.current.stableState).toBe("");
      expect(result.current.isEditing).toBe(true);

      jest.advanceTimersByTime(500);
      await renderHookResult.waitForNextUpdate();

      expect(result.current.state).toBe("hoge");
      expect(result.current.stableState).toBe("hoge");
      expect(result.current.isEditing).toBe(false);
    });

    expect(result.all.length - initialCount).toBeLessThanOrEqual(5);
  });

  it("The state should transition correctly when the delay value is changed.", async () => {
    expect(result.current.delay).toBe(1000);

    act(() => {
      result.current.setDelay(100000);
    });

    jest.advanceTimersByTime(100000);

    await act(async () => {
      result.current.setState("hoge");
      await renderHookResult.waitForNextUpdate();

      expect(result.current.state).toBe("hoge");
      expect(result.current.stableState).toBe("");
      expect(result.current.isEditing).toBe(true);

      jest.advanceTimersByTime(1000);

      expect(result.current.state).toBe("hoge");
      expect(result.current.stableState).toBe("");
      expect(result.current.isEditing).toBe(true);

      jest.advanceTimersByTime(1000);

      expect(result.current.state).toBe("hoge");
      expect(result.current.stableState).toBe("");
      expect(result.current.isEditing).toBe(true);

      jest.advanceTimersByTime(98000);
      await renderHookResult.waitForNextUpdate();

      expect(result.current.state).toBe("hoge");
      expect(result.current.stableState).toBe("hoge");
      expect(result.current.isEditing).toBe(false);
    });
  });

  it("no error when window will be closed", () => {
    window.dispatchEvent(new Event("beforeunload", { cancelable: true }));
  });

  it("onBeforeUnload callback is called when window will be closed", (done) => {
    const onBeforeUnloadCallback = () => {
      done();
      return false;
    };
    renderHookResult = renderHook(() =>
      useStableStateExtra<string>({
        initialState: "",
        onBeforeUnload: onBeforeUnloadCallback,
      })
    );

    window.dispatchEvent(new Event("beforeunload", { cancelable: true }));
  });
});

describe("useStableState", () => {
  let result: RenderResult<UseStableStateParams<string>>,
    renderHookResult: RenderHookResult<
      UseStableStateProps<string>,
      UseStableStateParams<string>
    >,
    currentState: (
      result: RenderResult<UseStableStateParams<string>>
    ) => string,
    currentStableState: (
      result: RenderResult<UseStableStateParams<string>>
    ) => string,
    currentSetState: (
      result: RenderResult<UseStableStateParams<string>>
    ) => React.Dispatch<React.SetStateAction<string>>;

  beforeEach(() => {
    renderHookResult = renderHook(() =>
      useStableState<string>({ initialState: "" })
    );

    result = renderHookResult.result;

    currentState = (result) => result.current[0];
    currentStableState = (result) => result.current[1];
    currentSetState = (result) => result.current[2];

    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("The initial condition to be correct.", () => {
    expect(currentState(result)).toBe("");
    expect(currentStableState(result)).toBe("");
  });

  it("State transitions should be correct when edited.", async () => {
    await act(async () => {
      currentSetState(result)("hoge");
      await renderHookResult.waitForNextUpdate();

      expect(currentState(result)).toBe("hoge");
      expect(currentStableState(result)).toBe("");

      jest.advanceTimersByTime(500);

      expect(currentState(result)).toBe("hoge");
      expect(currentStableState(result)).toBe("");

      jest.advanceTimersByTime(500);
      await renderHookResult.waitForNextUpdate();

      expect(currentState(result)).toBe("hoge");
      expect(currentStableState(result)).toBe("hoge");
    });
  });
});
