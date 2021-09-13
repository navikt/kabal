import React from 'react';
import { OppgaverPage } from '../../pages/oppgaver/oppgaver';
import { Redirect, Route, Switch } from 'react-router-dom';
import { EnhetensOppgaverPage } from '../../pages/enhetens-oppgaver/enhetens-oppgaver';
import { MineOppgaverPage } from '../../pages/mine-oppgaver/mine-oppgaver';

export const Routes: React.FC = () => (
  <Switch>
    <Route exact path="/oppgaver">
      <Redirect to="/oppgaver/1" />
    </Route>
    <Route exact path="/oppgaver/:page">
      <OppgaverPage />
    </Route>
    <Route exact path="/enhetensoppgaver">
      <EnhetensOppgaverPage />
    </Route>
    <Route exact path="/mineoppgaver">
      <MineOppgaverPage />
    </Route>
    <Route exact path="/mineoppgaver/:side">
      <MineOppgaverPage />
    </Route>
    {/* <Route exact path="/klagebehandling/:id" render={() => <KlagebehandlingLaster />} /> */}
    {/* <Route exact path="/mineoppgaver" render={() => <MineSaker />} /> */}
    {/* <Route exact path="/sok" render={() => <Sok />} /> */}
    {/* <Route exact path="/innstillinger" render={() => <Innstillinger />} /> */}
    {/* <Route exact path="/admin" render={() => <Admin />} /> */}
    <Redirect to="/oppgaver" />
  </Switch>
);
