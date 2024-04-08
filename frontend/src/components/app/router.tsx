import React from 'react';
import { Route, Routes as Switch } from 'react-router-dom';
import { AccessRightsPage } from '@app/pages/access-rights/access-rights';
import { AdminPage } from '@app/pages/admin/admin';
import { AnkebehandlingPage } from '@app/pages/ankebehandling/ankebehandling';
import { BunnteksterPage } from '@app/pages/bunntekster/bunntekster';
import { GodeFormuleringerPage } from '@app/pages/gode-formuleringer/gode-formuleringer';
import { KlagebehandlingPage } from '@app/pages/klagebehandling/klagebehandling';
import { LandingPage } from '@app/pages/landing-page/landing-page';
import { MalteksterPage } from '@app/pages/maltekster/maltekster';
import { MaltekstseksjonerPage } from '@app/pages/maltekstseksjoner/maltekstseksjoner';
import { MineOppgaverPage } from '@app/pages/mine-oppgaver/mine-oppgaver';
import { OppgaverPage } from '@app/pages/oppgaver/oppgaver';
import { OppgavestyringPage } from '@app/pages/oppgavestyring/oppgavestyring';
import { RedigerbareMalteksterPage } from '@app/pages/redigerbare-maltekster/redigerbare-maltekster';
import { RegelverkPage } from '@app/pages/regelverk/regelverk';
import { SearchPage } from '@app/pages/search/search';
import { SettingsPage } from '@app/pages/settings/settings';
import { ToppteksterPage } from '@app/pages/topptekster/topptekster';
import { TrygderettsankebehandlingPage } from '@app/pages/trygderettsankebehandling/trygderettsankebehandling';

export const Router = () => (
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
);
