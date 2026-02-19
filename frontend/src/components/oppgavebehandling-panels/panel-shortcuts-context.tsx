import { IS_MAC, isMetaKey, Keys } from '@app/keys';
import { createContext, type RefObject, useCallback, useContext, useEffect, useRef } from 'react';
import { usePanelContainerRef } from './panel-container-ref-context';

type PanelNumber = 1 | 2 | 3 | 4 | 5 | 6;

const PANEL_NUMBERS = new Set<number>([1, 2, 3, 4, 5, 6]);

const isPanelNumber = (n: number): n is PanelNumber => PANEL_NUMBERS.has(n);

interface PanelShortcutsContextValue {
  register: (panel: PanelNumber, focusFn: () => void) => () => void;
  reportFocus: (panel: PanelNumber) => void;
}

const PanelShortcutsContext = createContext<PanelShortcutsContextValue>({
  register: () => () => undefined,
  reportFocus: () => undefined,
});

interface PanelShortcutsProviderProps {
  children: React.ReactNode;
}

type PanelRegistry = Map<PanelNumber, () => void>;

const getSortedRegisteredPanels = (registry: PanelRegistry): PanelNumber[] =>
  [...registry.keys()].sort((a, b) => a - b);

/**
 * On macOS the navigate shortcut is Option+Arrow.
 * On Windows/Linux using Alt would hijack browser history (Alt+Arrow), so
 * the navigate shortcut is Ctrl+Arrow.
 */
const isNavigateShortcut: (e: KeyboardEvent) => boolean = IS_MAC
  ? (e) => e.altKey && !e.metaKey && !e.ctrlKey
  : (e) => e.ctrlKey && !e.altKey && !e.metaKey;

const isArrowLeftOrRight = (key: string): key is Keys.ArrowLeft | Keys.ArrowRight =>
  key === Keys.ArrowLeft || key === Keys.ArrowRight;

const navigateToPanel = (registry: PanelRegistry, panel: PanelNumber): PanelNumber | null => {
  const focusFn = registry.get(panel);

  if (focusFn === undefined) {
    return null;
  }

  focusFn();

  return panel;
};

const handleNavigatePanel = (
  registry: PanelRegistry,
  lastFocusedPanel: PanelNumber | null,
  direction: Keys.ArrowLeft | Keys.ArrowRight,
): PanelNumber | null => {
  const sortedPanels = getSortedRegisteredPanels(registry);

  if (sortedPanels.length === 0) {
    return null;
  }

  const currentIndex = lastFocusedPanel === null ? -1 : sortedPanels.indexOf(lastFocusedPanel);

  const nextIndex =
    direction === Keys.ArrowRight
      ? (currentIndex + 1) % sortedPanels.length
      : (currentIndex - 1 + sortedPanels.length) % sortedPanels.length;

  const nextPanel = sortedPanels[nextIndex];

  if (nextPanel === undefined) {
    return null;
  }

  return navigateToPanel(registry, nextPanel);
};

const handleDirectPanel = (registry: PanelRegistry, panel: number): PanelNumber | null => {
  if (!isPanelNumber(panel)) {
    return null;
  }

  return navigateToPanel(registry, panel);
};

export const PanelShortcutsProvider = ({ children }: PanelShortcutsProviderProps) => {
  const registryRef = useRef(new Map<PanelNumber, () => void>());
  const lastFocusedPanelRef = useRef<PanelNumber | null>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.shiftKey) {
        return;
      }

      // Navigate to previous/next panel.
      // macOS: Option+Arrow | Windows/Linux: Ctrl+Arrow
      if (isNavigateShortcut(e) && isArrowLeftOrRight(e.key)) {
        e.preventDefault();

        const result = handleNavigatePanel(registryRef.current, lastFocusedPanelRef.current, e.key);

        if (result !== null) {
          lastFocusedPanelRef.current = result;
        }

        return;
      }

      // Ctrl/Cmd+1-6: focus specific panel (no Alt modifier).
      if (!isMetaKey(e) || e.altKey) {
        return;
      }

      const num = Number.parseInt(e.key, 10);

      if (Number.isNaN(num)) {
        // Not a number key, ignore.
        return;
      }

      if (num === 0) {
        // Ctrl/Cmd+0 is commonly used to reset zoom level in browsers, so we want to allow that through and not interfere with it.
        return;
      }

      e.preventDefault(); // Prevent browser shortcuts for Ctrl/Cmd+1-9.

      const result = handleDirectPanel(registryRef.current, num);

      if (result !== null) {
        lastFocusedPanelRef.current = result;
      }
    };

    window.addEventListener('keydown', handler);

    return () => window.removeEventListener('keydown', handler);
  }, []);

  const register = useCallback((panel: PanelNumber, focusFn: () => void): (() => void) => {
    registryRef.current.set(panel, focusFn);

    return () => {
      if (registryRef.current.get(panel) === focusFn) {
        registryRef.current.delete(panel);

        if (lastFocusedPanelRef.current === panel) {
          lastFocusedPanelRef.current = null;
        }
      }
    };
  }, []);

  const reportFocus = useCallback((panel: PanelNumber) => {
    lastFocusedPanelRef.current = panel;
  }, []);

  return <PanelShortcutsContext value={{ register, reportFocus }}>{children}</PanelShortcutsContext>;
};

export const usePanelShortcut = (
  panel: PanelNumber,
  focusFn: (() => void) | null,
  scrollRef: RefObject<HTMLElement | null>,
) => {
  const { register, reportFocus } = useContext(PanelShortcutsContext);

  useEffect(() => {
    if (focusFn === null) {
      return;
    }

    const wrappedFocusFn = () => {
      focusFn();
      requestAnimationFrame(() => {
        scrollRef.current?.scrollIntoView({ inline: 'nearest', block: 'nearest' });
      });
    };

    return register(panel, wrappedFocusFn);
  }, [register, panel, focusFn, scrollRef]);

  useEffect(() => {
    const element = scrollRef.current;

    if (element === null || focusFn === null) {
      return;
    }

    const onFocusIn = () => reportFocus(panel);
    element.addEventListener('focusin', onFocusIn);

    return () => element.removeEventListener('focusin', onFocusIn);
  }, [scrollRef, panel, reportFocus, focusFn]);
};

/** Convenience hook for the common case: focus the nearest `PanelContainer` and scroll it into view. */
export const useFocusPanelShortcut = (panel: PanelNumber) => {
  const containerRef = usePanelContainerRef();
  const focusFn = useCallback(() => containerRef.current?.focus(), [containerRef]);
  usePanelShortcut(panel, focusFn, containerRef);
};
