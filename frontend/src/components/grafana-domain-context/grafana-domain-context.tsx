import { createContext, useContext } from 'react';

interface GrafanaDomainContextValue {
  domain: string;
}

export const GrafanaDomainContext = createContext<GrafanaDomainContextValue>({
  domain: 'unknown',
});

interface GrafanaDomainProviderProps {
  domain: string;
  children: React.ReactNode;
}

export const GrafanaDomainProvider = ({ domain, children }: GrafanaDomainProviderProps) => (
  <GrafanaDomainContext.Provider value={{ domain }}>{children}</GrafanaDomainContext.Provider>
);

export const useGrafanaDomain = () => {
  const { domain } = useContext(GrafanaDomainContext);

  if (domain === 'unknown') {
    throw new Error('useGrafanaDomain must be used within a GrafanaDomainProvider');
  }

  return domain;
};
