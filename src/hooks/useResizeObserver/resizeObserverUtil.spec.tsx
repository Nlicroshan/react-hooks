import "@testing-library/jest-dom";
import ResizeObserver from "resize-observer-polyfill";
import {
  observe,
  unobserve,
  elementListeners_only_for_test,
} from "./resizeObserverUtil";

jest.mock("resize-observer-polyfill", () => {
  const elementSet = new Set<Element>();
  let resizeHandler: any;

  return jest.fn().mockImplementation((callback) => {
    resizeHandler = callback;

    return {
      observe: jest.fn().mockImplementation((element: Element) => {
        console.log(element);
        elementSet.add(element);
      }),
      unobserve: jest.fn().mockImplementation((element: Element) => {
        elementSet.delete(element);
      }),
      elementSet,
      triggerResize: (elements: Element[]): void => {
        const observedElements = elements.filter((el) => elementSet.has(el));
        resizeHandler(observedElements.map((el) => ({ target: el })));
      },
    };
  });
});

const mockedResizeObserver = ResizeObserver as jest.Mock;

describe("resizeObserverUtil", () => {
  it("observe & unobserve should work", async () => {
    const instance = mockedResizeObserver.mock.results[0].value;
    const { elementSet, triggerResize } = instance;

    const elementA = document.createElement("div");
    const elementB = document.createElement("div");

    const callbackA1 = jest.fn();
    const callbackA2 = jest.fn();
    const callbackB = jest.fn();

    expect(elementSet.size).toBe(0);
    expect(elementListeners_only_for_test.size).toBe(0);

    observe(elementA, callbackA1);
    expect(elementListeners_only_for_test.size).toBe(1);
    expect(elementListeners_only_for_test.get(elementA).size).toBe(1);
    expect(elementSet.size).toBe(1);

    observe(elementA, callbackA2);
    expect(elementListeners_only_for_test.size).toBe(1);
    expect(elementListeners_only_for_test.get(elementA).size).toBe(2);
    expect(elementSet.size).toBe(1);

    triggerResize([elementA, elementB]);
    expect(callbackA1).lastCalledWith({ target: elementA });
    expect(callbackA2).lastCalledWith({ target: elementA });
    expect(callbackB).not.toBeCalled();

    observe(elementB, callbackB);
    expect(elementListeners_only_for_test.size).toBe(2);
    expect(elementListeners_only_for_test.get(elementB).size).toBe(1);
    expect(elementSet.size).toBe(2);

    unobserve(elementA, callbackA2);
    expect(elementListeners_only_for_test.size).toBe(2);
    expect(elementListeners_only_for_test.get(elementA).size).toBe(1);
    expect(elementSet.size).toBe(2);

    triggerResize([elementB]);
    expect(callbackB).lastCalledWith({ target: elementB });

    unobserve(elementB, callbackB);
    expect(elementListeners_only_for_test.size).toBe(1);
    expect(elementListeners_only_for_test.has(elementB)).toBeFalsy();
    expect(elementSet.size).toBe(1);

    unobserve(elementA, callbackA1);
    expect(elementListeners_only_for_test.size).toBe(0);
    expect(elementListeners_only_for_test.has(elementA)).toBeFalsy();
    expect(elementSet.size).toBe(0);
  });
});
