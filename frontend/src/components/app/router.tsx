import React from 'react';
import { Navigate, Route, Routes as Switch } from 'react-router-dom';
import { AdminPage } from '../../pages/admin/admin';
import { EnhetensOppgaverPage } from '../../pages/enhetens-oppgaver/enhetens-oppgaver';
import { KlagebehandlingPage } from '../../pages/klagebehandling/klagebehandling';
import { MineOppgaverPage } from '../../pages/mine-oppgaver/mine-oppgaver';
import { OppgaverPage } from '../../pages/oppgaver/oppgaver';
import { SearchPage } from '../../pages/search/search';
import { SettingsPage } from '../../pages/settings/settings';

export const Router = () => (
  <Switch>
    <Route path="/" element={<Navigate to="oppgaver/1" />} />

    <Route path="oppgaver">
      <Route path="" element={<Navigate to="1" />} />
      <Route path="0" element={<Navigate to="../1" />} />

      <Route path=":page" element={<OppgaverPage />} />
    </Route>

    <Route path="mineoppgaver" element={<MineOppgaverPage />} />
    <Route path="enhetensoppgaver" element={<EnhetensOppgaverPage />} />
    <Route path="sok" element={<SearchPage />} />
    <Route path="klagebehandling/:id" element={<KlagebehandlingPage />} />
    <Route path="innstillinger" element={<SettingsPage />} />
    <Route path="admin" element={<AdminPage />} />
  </Switch>
);
