import { type ReactNode, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';

const ITEM_HEIGHT = 32;
const OVERSCAN = 5;
const SCROLL_PADDING = 16;
const MAX_HEIGHT = ITEM_HEIGHT * 10.5;

export interface VirtualizedOptionListHandle {
  scrollToIndex: (index: number) => void;
}

interface VirtualizedOptionListProps<T> {
  options: T[];
  optionKey: (option: T) => string;
  highlightedIndex: number;
  onHighlight: (index: number) => void;
  renderOption: (option: T, index: number) => ReactNode;
  handleRef?: React.Ref<VirtualizedOptionListHandle>;
  enabled: boolean;
  /** Unique id for the listbox element. Used by combobox `aria-controls`. */
  listboxId: string;
  /** When true, sets `aria-multiselectable="true"` on the listbox. */
  multiselectable?: boolean;
  /** Set of currently selected option keys. Used to set `aria-selected` on each option. */
  selectedKeys: Set<string>;
  /** Called when an option is clicked. */
  onSelect?: (option: T) => void;
}

interface VirtualItem {
  index: number;
  start: number;
}

const getVirtualItems = (scrollTop: number, clientHeight: number, count: number): VirtualItem[] => {
  if (count === 0 || clientHeight === 0) {
    return [];
  }

  const startIndex = Math.max(0, Math.floor(scrollTop / ITEM_HEIGHT) - OVERSCAN);
  const endIndex = Math.min(count - 1, Math.ceil((scrollTop + clientHeight) / ITEM_HEIGHT) + OVERSCAN);

  const items: VirtualItem[] = [];

  for (let i = startIndex; i <= endIndex; i++) {
    items.push({ index: i, start: i * ITEM_HEIGHT });
  }

  return items;
};

const scrollToIndex = (scrollElement: HTMLDivElement, index: number, count: number): void => {
  if (index < 0 || index >= count) {
    return;
  }

  const itemTop = index * ITEM_HEIGHT;
  const itemBottom = itemTop + ITEM_HEIGHT;
  const { scrollTop, clientHeight } = scrollElement;

  const viewTop = scrollTop + SCROLL_PADDING;
  const viewBottom = scrollTop + clientHeight - SCROLL_PADDING;

  if (itemTop < viewTop) {
    scrollElement.scrollTop = itemTop - SCROLL_PADDING;
  } else if (itemBottom > viewBottom) {
    scrollElement.scrollTop = itemBottom - clientHeight + SCROLL_PADDING;
  }
};

/** Generate a stable DOM id for an option element, derived from the listbox id. */
export const getOptionId = (listboxId: string, key: string): string => `${listboxId}-option-${key}`;

export const VirtualizedOptionList = <T,>({
  options,
  optionKey,
  highlightedIndex,
  onHighlight,
  renderOption,
  handleRef,
  enabled,
  listboxId,
  multiselectable,
  selectedKeys,
  onSelect,
}: VirtualizedOptionListProps<T>) => {
  const scrollElementRef = useRef<HTMLDivElement>(null);
  const maxWidthRef = useRef(0);
  const [minWidth, setMinWidth] = useState(0);

  const [scrollTop, setScrollTop] = useState(0);
  const [clientHeight, setClientHeight] = useState(0);

  // Track whether we are currently updating from a ResizeObserver/scroll callback
  // to avoid re-entrant setState loops.
  const isUpdatingRef = useRef(false);

  const update = useCallback((el: HTMLDivElement) => {
    // Guard against re-entrant updates: a setState here triggers a re-render,
    // which can change children, which can trigger ResizeObserver again
    // synchronously in some browsers, causing an infinite loop.
    if (isUpdatingRef.current) {
      return;
    }

    isUpdatingRef.current = true;

    const newScrollTop = el.scrollTop;
    const newClientHeight = el.clientHeight;

    setScrollTop((prev) => (prev === newScrollTop ? prev : newScrollTop));
    setClientHeight((prev) => (prev === newClientHeight ? prev : newClientHeight));

    // Use microtask to reset the flag after React has processed the state updates
    // but before the next potential observer callback.
    queueMicrotask(() => {
      isUpdatingRef.current = false;
    });
  }, []);

  useEffect(() => {
    const el = scrollElementRef.current;

    if (el === null) {
      return;
    }

    // Initial measurement.
    update(el);

    const updateState = () => update(el);

    el.addEventListener('scroll', updateState, { passive: true });

    let requestAnimationFrameHandle = 0;

    const resizeObserver = new ResizeObserver(() => {
      // ResizeObserver callbacks can fire synchronously during layout in some
      // browsers. Defer to avoid infinite loops with setState → render → resize → setState.
      cancelAnimationFrame(requestAnimationFrameHandle);
      requestAnimationFrameHandle = requestAnimationFrame(updateState);
    });
    resizeObserver.observe(el);

    return () => {
      el.removeEventListener('scroll', updateState);
      cancelAnimationFrame(requestAnimationFrameHandle);
      resizeObserver.disconnect();
    };
  }, [update]);

  const measureElement = useCallback((element: Element | null) => {
    if (element === null) {
      return;
    }

    const width = element.scrollWidth;

    if (width > maxWidthRef.current) {
      maxWidthRef.current = width;
      setMinWidth(width);
    }
  }, []);

  const scrollToIndexFn = useCallback(
    (index: number) => {
      const el = scrollElementRef.current;

      if (el === null) {
        return;
      }

      scrollToIndex(el, index, options.length);
    },
    [options.length],
  );

  useImperativeHandle(handleRef, () => ({ scrollToIndex: scrollToIndexFn }), [scrollToIndexFn]);

  const totalHeight = options.length * ITEM_HEIGHT;
  const virtualItems = enabled ? getVirtualItems(scrollTop, clientHeight, options.length) : [];

  return (
    <div
      ref={scrollElementRef}
      className="overflow-y-auto"
      style={{ maxHeight: MAX_HEIGHT }}
      tabIndex={-1}
      role="listbox"
      id={listboxId}
      aria-multiselectable={multiselectable === true ? true : undefined}
    >
      <div style={{ height: totalHeight, minWidth, position: 'relative' }}>
        {virtualItems.map((virtualItem) => {
          const option = options[virtualItem.index];

          if (option === undefined) {
            return null;
          }

          const key = optionKey(option);
          const isHighlighted = virtualItem.index === highlightedIndex;
          const isSelected = selectedKeys.has(key);
          const optionElementId = getOptionId(listboxId, key);

          return (
            // biome-ignore lint/a11y/useKeyWithClickEvents: Keyboard selection is handled at the popover level via aria-activedescendant and onKeyDown.
            <div
              key={key}
              ref={measureElement}
              id={optionElementId}
              role="option"
              aria-selected={isSelected}
              tabIndex={-1}
              onClick={() => onSelect?.(option)}
              data-index={virtualItem.index}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: 'max-content',
                minWidth: '100%',
                transform: `translateY(${virtualItem.start}px)`,
              }}
              className={`rounded-sm px-1 ${isHighlighted ? HIGHLIGHT : ''}`}
              onMouseEnter={() => onHighlight(virtualItem.index)}
            >
              <div aria-hidden="true" className="pointer-events-none">
                {renderOption(option, virtualItem.index)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const HIGHLIGHT = 'bg-ax-bg-accent-moderate ring-2 ring-ax-border-accent ring-inset';
