import { type MutableRefObject, useMemo, useRef } from "react";

export const useCallbackRef = <T,>(
  defaultValue?: T,
  callback?: (newValue: T, oldValue: T) => void
): MutableRefObject<T> => {
  const value = useRef(defaultValue);

  const ref = useMemo(() => ({
    get current() {
      return value.current;
    },
    set current(newValue) {
      const oldValue = value.current;

      if (oldValue !== newValue) {
        value.current = newValue;
        callback?.(newValue, oldValue);
      }
    },
  }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []);

  return ref;
}