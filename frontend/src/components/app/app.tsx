import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { Footer } from '../../components/footer/footer';
import { Header } from '../../components/header/header';
import store from '../../tilstand/konfigurerTilstand';
import { GlobalStyles } from './global-styles';
import { Routes } from './routes';
import '../../stilark/App.less';

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
