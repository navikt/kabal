import React from 'react';
import { Navigate, Route, Routes as Switch } from 'react-router-dom';
import { AdminPage } from '../../pages/admin/admin';
import { AnkebehandlingPage } from '../../pages/ankebehandling/ankebehandling';
import { EnhetensOppgaverPage } from '../../pages/enhetens-oppgaver/enhetens-oppgaver';
import { GodeFormuleringerPage } from '../../pages/gode-formuleringer/gode-formuleringer';
import { KlagebehandlingPage } from '../../pages/klagebehandling/klagebehandling';
import { MalteksterPage } from '../../pages/maltekster/maltekster';
import { MineOppgaverPage } from '../../pages/mine-oppgaver/mine-oppgaver';
import { OppgaverPage } from '../../pages/oppgaver/oppgaver';
import { RedigerbareMalteksterPage } from '../../pages/redigerbare-maltekster/redigerbare-maltekster';
import { RegelverkPage } from '../../pages/regelverk/regelverk';
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
    <Route path="ankebehandling/:id" element={<AnkebehandlingPage />} />

    <Route path="maltekster/:id" element={<MalteksterPage />} />
    <Route path="maltekster/" element={<MalteksterPage />} />
    <Route path="redigerbare-maltekster/:id" element={<RedigerbareMalteksterPage />} />
    <Route path="redigerbare-maltekster/" element={<RedigerbareMalteksterPage />} />
    <Route path="gode-formuleringer/:id" element={<GodeFormuleringerPage />} />
    <Route path="gode-formuleringer/" element={<GodeFormuleringerPage />} />
    <Route path="regelverk/:id" element={<RegelverkPage />} />
    <Route path="regelverk/" element={<RegelverkPage />} />

    <Route path="innstillinger" element={<SettingsPage />} />
    <Route path="admin" element={<AdminPage />} />
  </Switch>
);
