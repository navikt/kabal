import { createContext, useCallback, useRef } from 'react';

type GetFn = (tabId: string) => Window | undefined;
type SetFn = (tabId: string, tabRef: Window) => void;

interface ITabContext {
  getTabRef: GetFn;
  setTabRef: SetFn;
}

export const TabContext = createContext<ITabContext>({
  getTabRef: () => undefined,
  setTabRef: () => {},
});

interface Props {
  children: React.ReactNode;
}

export const TabContextElement = ({ children }: Props) => {
  const tabRefMap = useRef<Record<string, Window>>({});

  const getTabRef = useCallback<GetFn>((tabId) => tabRefMap.current[tabId], []);

  const setTabRef = useCallback<SetFn>((tabId, tabRef) => {
    tabRefMap.current[tabId] = tabRef;
  }, []);

  return <TabContext.Provider value={{ getTabRef, setTabRef }}>{children}</TabContext.Provider>;
};
