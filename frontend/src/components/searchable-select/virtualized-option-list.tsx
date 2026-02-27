import { type ReactNode, useCallback, useImperativeHandle, useRef, useState, useSyncExternalStore } from 'react';

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

export const VirtualizedOptionList = <T,>({
  options,
  optionKey,
  highlightedIndex,
  onHighlight,
  renderOption,
  handleRef,
  enabled,
}: VirtualizedOptionListProps<T>) => {
  const scrollElementRef = useRef<HTMLDivElement>(null);
  const maxWidthRef = useRef(0);
  const [minWidth, setMinWidth] = useState(0);

  // Subscribe to scroll and resize events to re-render when visible range changes.
  const prevSnapshotRef = useRef<[number, number]>([0, 0]);

  const [scrollTop, clientHeight] = useSyncExternalStore<[number, number]>(
    useCallback((onStoreChange) => {
      const el = scrollElementRef.current;

      if (el === null) {
        return () => undefined;
      }

      el.addEventListener('scroll', onStoreChange, { passive: true });

      const resizeObserver = new ResizeObserver(onStoreChange);
      resizeObserver.observe(el);

      return () => {
        el.removeEventListener('scroll', onStoreChange);
        resizeObserver.disconnect();
      };
    }, []),
    useCallback(() => {
      const el = scrollElementRef.current;

      const scrollTop = el?.scrollTop ?? 0;
      const clientHeight = el?.clientHeight ?? 0;

      const prev = prevSnapshotRef.current;

      if (prev[0] === scrollTop && prev[1] === clientHeight) {
        return prev;
      }

      const next: [number, number] = [scrollTop, clientHeight];
      prevSnapshotRef.current = next;

      return next;
    }, []),
  );

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
    <div ref={scrollElementRef} className="overflow-y-auto" style={{ maxHeight: MAX_HEIGHT }}>
      <div style={{ height: totalHeight, minWidth, position: 'relative' }}>
        {virtualItems.map((virtualItem) => {
          const option = options[virtualItem.index];

          if (option === undefined) {
            return null;
          }

          const key = optionKey(option);
          const isHighlighted = virtualItem.index === highlightedIndex;

          return (
            // biome-ignore lint/a11y/noStaticElementInteractions: onMouseEnter is only used for visual hover highlighting, not interactive behavior.
            <div
              key={key}
              ref={measureElement}
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
              {renderOption(option, virtualItem.index)}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const HIGHLIGHT = 'bg-ax-bg-accent-moderate ring-2 ring-ax-border-accent ring-inset';
