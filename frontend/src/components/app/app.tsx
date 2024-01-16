import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { UserLoader } from '@app/components/app/user';
import { NavHeader } from '@app/components/header/header';
import { Toasts } from '@app/components/toast/toasts';
import { reduxStore } from '@app/redux/configure-store';
import { GlobalStyles } from './global-styles';
import { Router } from './router';

export const App = () => (
  <React.StrictMode>
    <Provider store={reduxStore}>
      <UserLoader>
        <BrowserRouter>
          <GlobalStyles />
          <NavHeader />
          <Router />
          <Toasts />
        </BrowserRouter>
      </UserLoader>
    </Provider>
  </React.StrictMode>
);
