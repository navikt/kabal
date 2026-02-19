import { createContext, type RefObject, useContext, useEffect, useRef } from 'react';

type EditorFocusFn = (() => void) | null;

const EditorPanelFocusContext = createContext<RefObject<EditorFocusFn>>({ current: null });

export const EditorPanelFocusProvider = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef<EditorFocusFn>(null);

  return <EditorPanelFocusContext value={ref}>{children}</EditorPanelFocusContext>;
};

export const useSetEditorPanelFocus = (focusFn: EditorFocusFn) => {
  const ref = useContext(EditorPanelFocusContext);

  useEffect(() => {
    if (focusFn === null) {
      return;
    }

    ref.current = focusFn;

    return () => {
      if (ref.current === focusFn) {
        ref.current = null;
      }
    };
  }, [ref, focusFn]);
};

export const useEditorPanelFocusRef = () => useContext(EditorPanelFocusContext);
