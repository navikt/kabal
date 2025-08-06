import { createContext } from 'react';

interface ContextProps {
  isOpen: boolean;
  close: () => void;
}

export const Context = createContext<ContextProps>({ isOpen: false, close: () => undefined });
