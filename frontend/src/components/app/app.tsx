import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { NavHeader } from '../../components/header/header';
import { reduxStore } from '../../redux/configure-store';
import { Toasts } from '../toast/toasts';
import { GlobalStyles } from './global-styles';
import { Router } from './router';

export const App = () => (
  <React.StrictMode>
    <Provider store={reduxStore}>
      <BrowserRouter>
        <GlobalStyles />
        <NavHeader />
        <Router />
        <Toasts />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
