import { isMetaKey } from '@app/keys';
import { createContext, useCallback, useContext, useEffect, useRef } from 'react';

type PanelNumber = 1 | 2 | 3 | 4 | 5 | 6;

const PANEL_NUMBERS = new Set<number>([1, 2, 3, 4, 5, 6]);

const isPanelNumber = (n: number): n is PanelNumber => PANEL_NUMBERS.has(n);

interface PanelShortcutsContextValue {
  register: (panel: PanelNumber, focusFn: () => void) => () => void;
}

const PanelShortcutsContext = createContext<PanelShortcutsContextValue>({
  register: () => () => undefined,
});

interface PanelShortcutsProviderProps {
  children: React.ReactNode;
}

export const PanelShortcutsProvider = ({ children }: PanelShortcutsProviderProps) => {
  const registryRef = useRef(new Map<PanelNumber, () => void>());

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!isMetaKey(e) || e.shiftKey || e.altKey) {
        return;
      }

      const num = Number.parseInt(e.key, 10);

      if (num === 0) {
        // Ctrl/Cmd+0 is commonly used to reset zoom level in browsers, so we want to allow that through and not interfere with it.
        return;
      }

      if (!Number.isNaN(num)) {
        e.preventDefault();
      }

      if (!isPanelNumber(num)) {
        // If it's not a valid panel number, we don't want to do anything.
        return;
      }

      const focusFn = registryRef.current.get(num);

      if (focusFn === undefined) {
        return;
      }

      focusFn();
    };

    window.addEventListener('keydown', handler);

    return () => window.removeEventListener('keydown', handler);
  }, []);

  const register = useCallback((panel: PanelNumber, focusFn: () => void): (() => void) => {
    registryRef.current.set(panel, focusFn);

    return () => {
      if (registryRef.current.get(panel) === focusFn) {
        registryRef.current.delete(panel);
      }
    };
  }, []);

  return <PanelShortcutsContext value={{ register }}>{children}</PanelShortcutsContext>;
};

export const usePanelShortcut = (panel: PanelNumber, focusFn: (() => void) | null) => {
  const { register } = useContext(PanelShortcutsContext);

  useEffect(() => {
    if (focusFn === null) {
      return;
    }

    return register(panel, focusFn);
  }, [register, panel, focusFn]);
};
