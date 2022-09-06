import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";
import "@testing-library/jest-dom";
import { useCallbackRef } from "./useCallbackRef";

describe("useCallbackRef", () => {
  it("should work", () => {
    const elementCallback = jest.fn();
    const dataCallback = jest.fn();

    const { result: { current: elementRef } } = renderHook(() => useCallbackRef(null, elementCallback));
    const { result: { current: dataRef } } = renderHook(() => useCallbackRef(1, dataCallback));

    const Component = (): React.ReactElement => {
      return (<div ref={elementRef} onClick={() => dataRef.current++}>test</ div>);
    };

    const { getByText, unmount } = render(<Component />);
    const div = getByText("test");

    expect(elementCallback).lastCalledWith(div, null);
    expect(elementRef.current).toBe(div);
    expect(dataRef.current).toBe(1);

    fireEvent.click(div);

    expect(dataCallback).lastCalledWith(2, 1);
    expect(dataRef.current).toBe(2);

    unmount();

    expect(elementCallback).lastCalledWith(null, div);
    expect(elementRef.current).toBe(null);
  });
});
