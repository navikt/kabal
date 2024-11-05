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

// biome-ignore lint/performance/noBarrelFile: https://testing-library.com/docs/react-testing-library/setup#custom-render
// biome-ignore lint/performance/noReExportAll: https://testing-library.com/docs/react-testing-library/setup#custom-render
export * from '@testing-library/react';
export { customRender as render };
