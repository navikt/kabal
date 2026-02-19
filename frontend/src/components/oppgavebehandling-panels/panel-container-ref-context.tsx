import { createContext, type RefObject, useContext } from 'react';

export const PanelContainerRefContext = createContext<RefObject<HTMLElement | null>>({ current: null });

export const usePanelContainerRef = () => useContext(PanelContainerRefContext);
