import ResizeObserver from "resize-observer-polyfill";

export type ResizeCallback = (entity: ResizeObserverEntry) => void;

const elementListeners = new Map<Element, Set<ResizeCallback>>();

// for testing only
export const elementListeners_only_for_test =
  process.env.NODE_ENV === "test"
    ? elementListeners
    : /* istanbul ignore next */ null;

const resizeObserverCallback = (entries: ResizeObserverEntry[]): void => {
  entries.forEach((entity) => {
    const { target } = entity;
    elementListeners.get(target)?.forEach((callback) => callback(entity));
  });
};

const resizeObserver = new ResizeObserver(resizeObserverCallback);

export const observe = (element: Element, callback: ResizeCallback): void => {
  if (!elementListeners.has(element)) {
    elementListeners.set(element, new Set());
    resizeObserver.observe(element);
  }

  elementListeners.get(element).add(callback);
};

export const unobserve = (element: Element, callback: ResizeCallback): void => {
  if (elementListeners.has(element)) {
    elementListeners.get(element).delete(callback);

    if (elementListeners.get(element).size === 0) {
      resizeObserver.unobserve(element);
      elementListeners.delete(element);
    }
  }
};
