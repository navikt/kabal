import React from 'react';
import { Provider } from 'react-redux';
import store from '../../tilstand/konfigurerTilstand';
import { BrowserRouter } from 'react-router-dom';
import { Header } from '../../components/header/header';
import { Footer } from '../../components/footer/footer';
import { GlobalStyles } from './global-styles';
import { Routes } from './routes';

export const App = () => (
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <GlobalStyles />

        <Header />

        <Routes />

        <Footer />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
