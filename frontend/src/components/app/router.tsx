import React, { Suspense, lazy } from 'react';
import { Route, Routes as Switch } from 'react-router-dom';
import { LandingPage } from '@app/pages/landing-page/landing-page';
import TrygderettsankebehandlingPage from '@app/pages/trygderettsankebehandling/trygderettsankebehandling';
import { useGetUserQuery } from '@app/redux-api/bruker';
import { AppLoader } from './loader';

const AdminPage = lazy(() => import('../../pages/admin/admin'));
const AnkebehandlingPage = lazy(() => import('../../pages/ankebehandling/ankebehandling'));
const BunnteksterPage = lazy(() => import('../../pages/bunntekster/bunntekster'));
const OppgavestyringPage = lazy(() => import('../../pages/oppgavestyring/oppgavestyring'));
const GodeFormuleringerPage = lazy(() => import('../../pages/gode-formuleringer/gode-formuleringer'));
const KlagebehandlingPage = lazy(() => import('../../pages/klagebehandling/klagebehandling'));
const MalteksterPage = lazy(() => import('../../pages/maltekster/maltekster'));
const MaltekstseksjonerPage = lazy(() => import('../../pages/maltekstseksjoner/maltekstseksjoner'));
const MineOppgaverPage = lazy(() => import('../../pages/mine-oppgaver/mine-oppgaver'));
const OppgaverPage = lazy(() => import('../../pages/oppgaver/oppgaver'));
const RedigerbareMalteksterPage = lazy(() => import('../../pages/redigerbare-maltekster/redigerbare-maltekster'));
const RegelverkPage = lazy(() => import('../../pages/regelverk/regelverk'));
const SearchPage = lazy(() => import('../../pages/search/search'));
const SettingsPage = lazy(() => import('../../pages/settings/settings'));
const ToppteksterPage = lazy(() => import('../../pages/topptekster/topptekster'));
const AccessRightsPage = lazy(() => import('../../pages/access-rights/access-rights'));

export const Router = () => {
  const { isLoading, isUninitialized, isError, data: user } = useGetUserQuery();

  if (isLoading || isUninitialized || user === undefined) {
    return <AppLoader text="Laster bruker..." />;
  }

  if (isError) {
    return <AppLoader text="Kunne ikke laste bruker." />;
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

        <Route
          path="maltekstseksjoner/:id/versjoner/:maltekstseksjonVersionId/tekster/:textId"
          element={<MaltekstseksjonerPage />}
        />
        <Route path="maltekstseksjoner/:id/versjoner/:maltekstseksjonVersionId" element={<MaltekstseksjonerPage />} />
        <Route path="maltekstseksjoner/:id" element={<MaltekstseksjonerPage />} />
        <Route path="maltekstseksjoner" element={<MaltekstseksjonerPage />} />

        <Route path="maltekster/:id/versjoner/:versionId" element={<MalteksterPage />} />
        <Route path="maltekster/:id" element={<MalteksterPage />} />
        <Route path="maltekster" element={<MalteksterPage />} />

        <Route path="redigerbare-maltekster/:id/versjoner/:versionId" element={<RedigerbareMalteksterPage />} />
        <Route path="redigerbare-maltekster/:id" element={<RedigerbareMalteksterPage />} />
        <Route path="redigerbare-maltekster/" element={<RedigerbareMalteksterPage />} />

        <Route path="gode-formuleringer/:id/versjoner/:versionId" element={<GodeFormuleringerPage />} />
        <Route path="gode-formuleringer/:id" element={<GodeFormuleringerPage />} />
        <Route path="gode-formuleringer/" element={<GodeFormuleringerPage />} />

        <Route path="regelverk/:id/versjoner/:versionId" element={<RegelverkPage />} />
        <Route path="regelverk/:id" element={<RegelverkPage />} />
        <Route path="regelverk/" element={<RegelverkPage />} />

        <Route path="topptekster/:id/versjoner/:versionId" element={<ToppteksterPage />} />
        <Route path="topptekster/:id" element={<ToppteksterPage />} />
        <Route path="topptekster/" element={<ToppteksterPage />} />

        <Route path="bunntekster/:id/versjoner/:versionId" element={<BunnteksterPage />} />
        <Route path="bunntekster/:id" element={<BunnteksterPage />} />
        <Route path="bunntekster/" element={<BunnteksterPage />} />

        <Route path="innstillinger" element={<SettingsPage />} />
        <Route path="tilgangsstyring" element={<AccessRightsPage />} />
        <Route path="admin" element={<AdminPage />} />
      </Switch>
    </Suspense>
  );
};
