import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { StaticDataLoader } from '@app/components/app/static-data-context';
import { NavHeader } from '@app/components/header/header';
import { Toasts } from '@app/components/toast/toasts';
import { reduxStore } from '@app/redux/configure-store';
import { GlobalStyles } from './global-styles';
import { Router } from './router';

export const App = () => (
  <React.StrictMode>
    <Provider store={reduxStore}>
      <StaticDataLoader>
        <BrowserRouter>
          <GlobalStyles />
          <NavHeader />
          <Router />
          <Toasts />
        </BrowserRouter>
      </StaticDataLoader>
    </Provider>
  </React.StrictMode>
);
