import { reduxStore } from '@app/redux/configure-store';
import { type RenderOptions, render } from '@testing-library/react';
import type React from 'react';
import type { ReactElement } from 'react';
import { Provider } from 'react-redux';

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <Provider store={reduxStore}>{children}</Provider>;
};

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: AllTheProviders, ...options });

// biome-ignore lint/performance/noBarrelFile: Tests
// biome-ignore lint/performance/noReExportAll: Tests
export * from '@testing-library/react';
export { customRender as render };
