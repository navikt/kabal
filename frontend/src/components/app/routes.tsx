import React from 'react';
import { OppgaverPage } from '../../pages/oppgaver/oppgaver';
import { Redirect, Route, Switch } from 'react-router-dom';
import { EnhetensOppgaverPage } from '../../pages/enhetens-oppgaver/enhetens-oppgaver';
import { MineOppgaverPage } from '../../pages/mine-oppgaver/mine-oppgaver';
import { SearchPage } from '../../pages/search/search';
import { KlagebehandlingPage } from '../../pages/klagebehandling/klagebehandling';
import { SettingsPage } from '../../pages/settings/settings';

export const Routes: React.FC = () => (
  <Switch>
    <Route exact path="/oppgaver">
      <Redirect to="/oppgaver/1" />
    </Route>
    <Route exact path="/oppgaver/0">
      <Redirect to="/oppgaver/1" />
    </Route>
    <Route exact path="/oppgaver/:page">
      <OppgaverPage />
    </Route>
    <Route exact path="/mineoppgaver">
      <MineOppgaverPage />
    </Route>
    <Route exact path="/mineoppgaver/:side">
      <MineOppgaverPage />
    </Route>
    <Route exact path="/enhetensoppgaver">
      <EnhetensOppgaverPage />
    </Route>
    <Route exact path="/sok">
      <SearchPage />
    </Route>
    <Route exact path="/klagebehandling/:id">
      <KlagebehandlingPage />
    </Route>
    <Route exact path="/innstillinger" render={() => <SettingsPage />} />
    {/* <Route exact path="/admin" render={() => <Admin />} /> */}
    <Redirect to="/oppgaver/1" />
  </Switch>
);
