import React from 'react';
import { Provider } from 'react-redux';
import store from '../../tilstand/konfigurerTilstand';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import { OppgaverPage } from '../../pages/oppgaver/oppgaver';
import { MineOppgaverPage } from '../../pages/mine-oppgaver/mine-oppgaver';
import { EnhetensOppgaverPage } from '../../pages/enhetens-oppgaver/enhetens-oppgaver';
import { Header } from '../../components/header/header';
import { Footer } from '../../components/footer/footer';
import { GlobalStyles } from './global-styles';

export const App = () => (
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <GlobalStyles />

        <Header />

        <Switch>
          <Route exact path="/oppgaver" render={() => <OppgaverPage />} />
          <Route exact path="/oppgaver/:side" render={() => <OppgaverPage />} />
          <Route exact path="/enhetensoppgaver" render={() => <EnhetensOppgaverPage />} />
          <Route exact path="/mineoppgaver" render={() => <MineOppgaverPage />} />
          <Route exact path="/mineoppgaver/:side" render={() => <MineOppgaverPage />} />
          {/* <Route exact path="/klagebehandling/:id" render={() => <KlagebehandlingLaster />} /> */}
          {/* <Route exact path="/mineoppgaver" render={() => <MineSaker />} /> */}
          {/* <Route exact path="/sok" render={() => <Sok />} /> */}
          {/* <Route exact path="/innstillinger" render={() => <Innstillinger />} /> */}
          {/* <Route exact path="/admin" render={() => <Admin />} /> */}
          <Redirect to="/oppgaver" />
        </Switch>

        <Footer />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
