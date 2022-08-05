import lodash from "lodash";
import { wrapFunction } from "./wrapFunction";

const debounceSpy = jest.spyOn(lodash, "debounce");
const throttleSpy = jest.spyOn(lodash, "throttle");

describe("wrapFunction", () => {
  it("should work", async () => {
    const callback = jest.fn();

    const debounceCallback = wrapFunction(callback, {
      mode: "debounce",
      wait: 100,
    });
    expect(debounceSpy).lastCalledWith(callback, 100, undefined);

    const throttleCallback = wrapFunction(callback, {
      mode: "throttle",
      wait: 200,
    });
    expect(throttleSpy).lastCalledWith(callback, 200, undefined);

    const defaultCallback = wrapFunction(callback);
    expect(defaultCallback).toEqual(callback);

    const unknownCallback = wrapFunction(callback, { mode: "unknown" } as any);
    expect(unknownCallback).toEqual(callback);
  });
});
