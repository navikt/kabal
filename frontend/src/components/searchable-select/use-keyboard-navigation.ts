import { useCallback } from 'react';
import { isMetaKey, Keys } from '@/keys';

interface UseKeyboardNavigationOptions {
  filteredOptionsLength: number;
  setHighlightedIndex: React.Dispatch<React.SetStateAction<number>>;
  onEscape: () => void;
  /** Optional virtualizer-based scroll function. When provided, takes priority over DOM-based scrolling. */
  scrollToIndex: (index: number) => void;
}

export const useKeyboardNavigation = ({
  filteredOptionsLength,
  setHighlightedIndex,
  onEscape,
  scrollToIndex,
}: UseKeyboardNavigationOptions) => {
  const scroll = useCallback(
    (index: number) => {
      scrollToIndex(index);
    },
    [scrollToIndex],
  );

  return useCallback(
    (e: React.KeyboardEvent): boolean => {
      switch (e.key) {
        case Keys.ArrowDown: {
          e.preventDefault();

          if (isMetaKey(e)) {
            const last = filteredOptionsLength - 1;
            setHighlightedIndex(last);
            scroll(last);

            return true;
          }

          setHighlightedIndex((prev) => {
            const next = prev < filteredOptionsLength - 1 ? prev + 1 : 0;
            scroll(next);

            return next;
          });

          return true;
        }
        case Keys.ArrowUp: {
          e.preventDefault();

          if (isMetaKey(e)) {
            setHighlightedIndex(0);
            scroll(0);

            return true;
          }

          setHighlightedIndex((prev) => {
            const next = prev > 0 ? prev - 1 : filteredOptionsLength - 1;
            scroll(next);

            return next;
          });

          return true;
        }
        case Keys.Home: {
          e.preventDefault();
          setHighlightedIndex(0);
          scroll(0);

          return true;
        }
        case Keys.End: {
          e.preventDefault();
          const last = filteredOptionsLength - 1;
          setHighlightedIndex(last);
          scroll(last);

          return true;
        }
        case Keys.Escape: {
          e.preventDefault();
          onEscape();

          return true;
        }
        default: {
          return false;
        }
      }
    },
    [filteredOptionsLength, setHighlightedIndex, onEscape, scroll],
  );
};
