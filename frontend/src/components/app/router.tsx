import React, { Suspense, lazy } from 'react';
import { Route, Routes as Switch } from 'react-router-dom';
import { LandingPage } from '@app/pages/landing-page/landing-page';
import TrygderettsankebehandlingPage from '@app/pages/trygderettsankebehandling/trygderettsankebehandling';
import { useUser } from '@app/simple-api-state/use-user';
import { AppLoader } from './loader';

const AdminPage = lazy(() => import('../../pages/admin/admin'));
const AnkebehandlingPage = lazy(() => import('../../pages/ankebehandling/ankebehandling'));
const BunnteksterPage = lazy(() => import('../../pages/bunntekster/bunntekster'));
const OppgavestyringPage = lazy(() => import('../../pages/oppgavestyring/oppgavestyring'));
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

export const Router = () => {
  const { isLoading } = useUser();

  if (isLoading) {
    return <AppLoader text="Laster bruker..." />;
  }

  return (
    <Suspense fallback={<AppLoader text="Laster siden..." />}>
      <Switch>
        <Route path="/" element={<LandingPage />} />

        <Route path="oppgaver" element={<OppgaverPage />} />

        <Route path="mineoppgaver" element={<MineOppgaverPage />} />
        <Route path="oppgavestyring" element={<OppgavestyringPage />} />

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
};
