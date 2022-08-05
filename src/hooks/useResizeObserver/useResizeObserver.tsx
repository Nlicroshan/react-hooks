import {
  useState,
  useCallback,
  useRef,
  useLayoutEffect,
  type RefObject,
} from "react";
import { observe, unobserve } from "./resizeObserverUtil";
import { wrapFunction, type WrapOptions } from "../../utils/wrapFunction";

interface ElementSize {
  width: number;
  height: number;
}

export interface ResizeObserveProps<T> {
  targetRef?: RefObject<T>;
  onResize?: (size: ElementSize) => void;
  heightTriggerUpdate?: boolean;
  widthTriggerUpdate?: boolean;
  triggerOptions?: WrapOptions;
}

export function useResizeObserver<T extends Element>(
  props?: ResizeObserveProps<T>
): [RefObject<T>, ElementSize] {
  const {
    targetRef,
    onResize,
    heightTriggerUpdate = true,
    widthTriggerUpdate = true,
    triggerOptions,
  } = props || {};

  const localRef = useRef<T>();
  const ref = targetRef ?? localRef;
  const [size, setSize] = useState<ElementSize>({ width: 0, height: 0 });

  const handleResize = useCallback(
    (entity: ResizeObserverEntry) => {
      // target.getClientRects() or contentRect
      const { target } = entity;
      const { clientWidth: width = 0, clientHeight: height = 0 } = target;

      setSize((prev) => {
        // skip if same size
        if (prev.width === width && prev.height === height) {
          return prev;
        }

        // skip if not watch update
        if (
          (prev.width === width && !heightTriggerUpdate) ||
          (prev.height === height && !widthTriggerUpdate)
        ) {
          return prev;
        }

        onResize?.({ width, height });

        return { width, height };
      });
    },
    [heightTriggerUpdate, widthTriggerUpdate, onResize]
  );

  useLayoutEffect(() => {
    if (
      typeof ref !== "object" ||
      ref === null ||
      !(ref.current instanceof Element)
    ) {
      throw new Error("ResizeObserver must observe an Element");
    }

    const element = ref.current;
    const _handleResize = wrapFunction(handleResize, triggerOptions as any);

    observe(element, _handleResize);

    return () => {
      unobserve(element, _handleResize);
      (_handleResize as any).cancel?.();
    };
  }, [handleResize, ref, triggerOptions]);

  return [ref, { ...size }];
}
