import { AppErrorBoundary } from '@app/components/app/error-boundary';
import { StaticDataLoader } from '@app/components/app/static-data-context';
import { reduxStore } from '@app/redux/configure-store';
import { StrictMode } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { GlobalStyles } from './global-styles';
import { Router } from './router';

export const App = () => (
  <StrictMode>
    <AppErrorBoundary>
      <GlobalStyles />
      <Provider store={reduxStore}>
        <StaticDataLoader>
          <BrowserRouter>
            <Router />
          </BrowserRouter>
        </StaticDataLoader>
      </Provider>
    </AppErrorBoundary>
  </StrictMode>
);
