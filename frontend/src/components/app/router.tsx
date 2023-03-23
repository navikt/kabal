import React, { Suspense, lazy } from 'react';
import { Navigate, Route, Routes as Switch } from 'react-router-dom';
import { LandingPage } from '@app/pages/landing-page/landing-page';
import TrygderettsankebehandlingPage from '@app/pages/trygderettsankebehandling/trygderettsankebehandling';
import { RouterLoader } from './loader';

const AdminPage = lazy(() => import('../../pages/admin/admin'));
const AnkebehandlingPage = lazy(() => import('../../pages/ankebehandling/ankebehandling'));
const BunnteksterPage = lazy(() => import('../../pages/bunntekster/bunntekster'));
const EnhetensOppgaverPage = lazy(() => import('../../pages/enhetens-oppgaver/enhetens-oppgaver'));
const GodeFormuleringerPage = lazy(() => import('../../pages/gode-formuleringer/gode-formuleringer'));
const KlagebehandlingPage = lazy(() => import('../../pages/klagebehandling/klagebehandling'));
const MalteksterPage = lazy(() => import('../../pages/maltekster/maltekster'));
const MineOppgaverPage = lazy(() => import('../../pages/mine-oppgaver/mine-oppgaver'));
const OppgaverPage = lazy(() => import('../../pages/oppgaver/oppgaver'));
const RedigerbareMalteksterPage = lazy(() => import('../../pages/redigerbare-maltekster/redigerbare-maltekster'));
const RegelverkPage = lazy(() => import('../../pages/regelverk/regelverk'));
const SearchPage = lazy(() => import('../../pages/search/search'));
const SettingsPage = lazy(() => import('../../pages/settings/settings'));
const ToppteksterPage = lazy(() => import('../../pages/topptekster/topptekster'));
const AccessRightsPage = lazy(() => import('../../pages/access-rights/access-rights'));

export const Router = () => (
  <Suspense fallback={<RouterLoader />}>
    <Switch>
      <Route path="/" element={<LandingPage />} />

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
      <Route path="trygderettsankebehandling/:id" element={<TrygderettsankebehandlingPage />} />

      <Route path="maltekster/:id" element={<MalteksterPage />} />
      <Route path="maltekster/" element={<MalteksterPage />} />
      <Route path="redigerbare-maltekster/:id" element={<RedigerbareMalteksterPage />} />
      <Route path="redigerbare-maltekster/" element={<RedigerbareMalteksterPage />} />
      <Route path="gode-formuleringer/:id" element={<GodeFormuleringerPage />} />
      <Route path="gode-formuleringer/" element={<GodeFormuleringerPage />} />
      <Route path="regelverk/:id" element={<RegelverkPage />} />
      <Route path="regelverk/" element={<RegelverkPage />} />
      <Route path="topptekster/" element={<ToppteksterPage />} />
      <Route path="topptekster/:id" element={<ToppteksterPage />} />
      <Route path="bunntekster/" element={<BunnteksterPage />} />
      <Route path="bunntekster/:id" element={<BunnteksterPage />} />

      <Route path="innstillinger" element={<SettingsPage />} />
      <Route path="tilgangsstyring" element={<AccessRightsPage />} />
      <Route path="admin" element={<AdminPage />} />
    </Switch>
  </Suspense>
);
