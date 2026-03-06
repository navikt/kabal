import { createContext, type RefObject, useCallback, useContext, useEffect, useRef } from 'react';

type EditorFocusFn = (() => void) | null;

interface EditorPanelFocusContextValue {
  focusRef: RefObject<EditorFocusFn>;
  pendingFocusRef: RefObject<boolean>;
}

const EditorPanelFocusContext = createContext<EditorPanelFocusContextValue>({
  focusRef: { current: null },
  pendingFocusRef: { current: false },
});

export const EditorPanelFocusProvider = ({ children }: { children: React.ReactNode }) => {
  const focusRef = useRef<EditorFocusFn>(null);
  const pendingFocusRef = useRef<boolean>(false);

  return <EditorPanelFocusContext value={{ focusRef, pendingFocusRef }}>{children}</EditorPanelFocusContext>;
};

export const useSetEditorPanelFocus = (focusFn: EditorFocusFn) => {
  const { focusRef, pendingFocusRef } = useContext(EditorPanelFocusContext);

  useEffect(() => {
    if (focusFn === null) {
      return;
    }

    focusRef.current = focusFn;

    if (pendingFocusRef.current) {
      pendingFocusRef.current = false;
      const frameId = requestAnimationFrame(() => focusFn());

      return () => {
        cancelAnimationFrame(frameId);

        if (focusRef.current === focusFn) {
          focusRef.current = null;
        }
      };
    }

    return () => {
      if (focusRef.current === focusFn) {
        focusRef.current = null;
      }
    };
  }, [focusRef, pendingFocusRef, focusFn]);
};

export const useEditorPanelFocusRef = () => useContext(EditorPanelFocusContext).focusRef;

export const useRequestEditorPanelFocus = () => {
  const { pendingFocusRef } = useContext(EditorPanelFocusContext);

  return useCallback(() => {
    pendingFocusRef.current = true;
  }, [pendingFocusRef]);
};
