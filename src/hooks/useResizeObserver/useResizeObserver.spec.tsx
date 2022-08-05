import React, { useRef } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import {
  useResizeObserver,
  type ResizeObserveProps,
} from "./useResizeObserver";
import { type ResizeCallback } from "./resizeObserverUtil";
import { act } from "react-dom/test-utils";

let resizeCallback: ResizeCallback;

jest.mock("./resizeObserverUtil", () => ({
  observe: (element: Element, callback: ResizeCallback) => {
    resizeCallback = callback;
  },
  unobserve: (element: Element, callback: ResizeCallback) => {
    resizeCallback = null;
  },
}));

const triggerResize = ({
  width: clientWidth,
  height: clientHeight,
}: {
  width: number;
  height: number;
}): void => {
  resizeCallback({
    target: { clientWidth, clientHeight },
  } as any);
};

const Component = (
  props: ResizeObserveProps<HTMLDivElement>
): React.ReactElement => {
  const [ref, { width, height }] = useResizeObserver<HTMLDivElement>(props);

  return (
    <div>
      <div ref={ref}>ref</div>
      <div data-testid="text">{`width: ${width}, height: ${height}`}</div>
    </div>
  );
};

describe("useResizeObserve", () => {
  it("should update entry for element on change", async () => {
    const onResize = jest.fn();

    render(<Component onResize={onResize} />);
    expect(screen.getByTestId("text")).toHaveTextContent("width: 0, height: 0");

    act(() => {
      triggerResize({
        width: 50,
        height: 100,
      });
    });
    expect(screen.getByTestId("text")).toHaveTextContent(
      "width: 50, height: 100"
    );
    expect(onResize).lastCalledWith({ width: 50, height: 100 });
    expect(onResize).toBeCalledTimes(1);

    // trigger same size
    act(() => {
      triggerResize({
        width: 50,
        height: 100,
      });
    });
    expect(onResize).toBeCalledTimes(1);
  });

  it("heightTriggerUpdate should work", async () => {
    const onResize = jest.fn();

    render(<Component onResize={onResize} heightTriggerUpdate={false} />);

    act(() => {
      triggerResize({
        width: 50,
        height: 100,
      });
    });
    expect(screen.getByTestId("text")).toHaveTextContent(
      "width: 50, height: 100"
    );
    expect(onResize).lastCalledWith({ width: 50, height: 100 });
    expect(onResize).toBeCalledTimes(1);

    act(() => {
      triggerResize({
        width: 50,
        height: 120,
      });
    });
    expect(screen.getByTestId("text")).toHaveTextContent(
      "width: 50, height: 100"
    );
    expect(onResize).toBeCalledTimes(1);
  });

  it("widthTriggerUpdate should work", async () => {
    const onResize = jest.fn();

    render(<Component onResize={onResize} widthTriggerUpdate={false} />);

    act(() => {
      triggerResize({
        width: 50,
        height: 100,
      });
    });
    expect(screen.getByTestId("text")).toHaveTextContent(
      "width: 50, height: 100"
    );
    expect(onResize).lastCalledWith({ width: 50, height: 100 });
    expect(onResize).toBeCalledTimes(1);

    act(() => {
      triggerResize({
        width: 40,
        height: 100,
      });
    });
    expect(screen.getByTestId("text")).toHaveTextContent(
      "width: 50, height: 100"
    );
    expect(onResize).toBeCalledTimes(1);
  });

  it("targetRef should work", async () => {
    const onResize = jest.fn();

    const Component = (): React.ReactElement => {
      const targetRef = useRef();
      const [, { width, height }] = useResizeObserver<HTMLDivElement>({
        targetRef,
        onResize,
      });

      return (
        <div>
          <div ref={targetRef}>ref</div>
          <div data-testid="text">{`width: ${width}, height: ${height}`}</div>
        </div>
      );
    };

    render(<Component />);

    act(() => {
      triggerResize({
        width: 50,
        height: 100,
      });
    });
    expect(screen.getByTestId("text")).toHaveTextContent(
      "width: 50, height: 100"
    );
    expect(onResize).lastCalledWith({ width: 50, height: 100 });

    act(() => {
      triggerResize({
        width: 40,
        height: 100,
      });
    });
    expect(screen.getByTestId("text")).toHaveTextContent(
      "width: 40, height: 100"
    );
    expect(onResize).lastCalledWith({ width: 40, height: 100 });
  });

  it("default should work", async () => {
    render(<Component />);

    act(() => {
      triggerResize({} as any);
    });
    expect(screen.getByTestId("text")).toHaveTextContent("width: 0, height: 0");
  });
});
