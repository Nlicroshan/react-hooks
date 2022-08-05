import { debounce, type DebounceSettings, throttle, type ThrottleSettings, } from "lodash";

interface DebounceOptions { mode: "debounce", wait?: number, options?: DebounceSettings }
interface ThrottleOptions { mode: "throttle", wait?: number, options?: ThrottleSettings }

export function wrapFunction<T extends (...args: any) => any>(fun: T): T;
export function wrapFunction<T extends (...args: any) => any>(fun: T, options: DebounceOptions): ReturnType<typeof debounce<T>>;
export function wrapFunction<T extends (...args: any) => any>(fun: T, options: ThrottleOptions): ReturnType<typeof throttle<T>>;
export function wrapFunction<T extends (...args: any) => any>(fun: T, wrapOptions?: DebounceOptions | ThrottleOptions) {
  if (!wrapOptions) return fun;

  const { mode, wait, options } = wrapOptions;

  switch (mode) {
    case "debounce": {
      return debounce(fun, wait, options);
    }
    case "throttle": {
      return throttle(fun, wait, options);
    }
    default: {
      return fun;
    }
  }
}
