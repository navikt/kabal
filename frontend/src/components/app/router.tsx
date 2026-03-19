import { Theme, VStack } from '@navikt/ds-react';
import { Navigate, Outlet, Route, Routes as Switch, useParams } from 'react-router-dom';
import { useAppTheme } from '@/app-theme';
import { NotFoundPage } from '@/components/app/not-found-page';
import { ProtectedRoute } from '@/components/app/protected-route';
import { NavHeader } from '@/components/header/header';
import { ModalEnum } from '@/components/svarbrev/row/row';
import { Toasts } from '@/components/toast/toasts';
import { VersionCheckerStatus } from '@/components/version-checker/version-checker-status';
import { TEXT_TYPE_BASE_PATH } from '@/domain/redaktør-paths';
import { AccessRightsPage } from '@/pages/access-rights/access-rights';
import { AdminPage } from '@/pages/admin/admin';
import { BunnteksterPage } from '@/pages/bunntekster/bunntekster';
import { GodeFormuleringerPage } from '@/pages/gode-formuleringer/gode-formuleringer';
import { LandingPage } from '@/pages/landing-page/landing-page';
import { MalteksterPage } from '@/pages/maltekster/maltekster';
import { MaltekstseksjonerPage } from '@/pages/maltekstseksjoner/maltekstseksjoner';
import { MineOppgaverPage } from '@/pages/mine-oppgaver/mine-oppgaver';
import { OppgavebehandlingPage } from '@/pages/oppgavebehandling/oppgavebehandling';
import { OppgaverPage } from '@/pages/oppgaver/oppgaver';
import { OppgavestyringPage } from '@/pages/oppgavestyring/oppgavestyring';
import { RedigerbareMalteksterPage } from '@/pages/redigerbare-maltekster/redigerbare-maltekster';
import { RegelverkPage } from '@/pages/regelverk/regelverk';
import { SearchPage } from '@/pages/search/search';
import { SettingsPage } from '@/pages/settings/settings';
import { SvarbrevPage } from '@/pages/svarbrev/svarbrev';
import { ToppteksterPage } from '@/pages/topptekster/topptekster';
import { Role } from '@/types/bruker';
import {
  GOD_FORMULERING_TYPE,
  MALTEKSTSEKSJON_TYPE,
  PlainTextTypes,
  REGELVERK_TYPE,
  RichTextTypes,
} from '@/types/common-text-types';

const RedirectToBehandling = () => {
  const { oppgaveId } = useParams();
  return <Navigate to={`/behandling/${oppgaveId}`} replace />;
};

export const Router = () => (
  <Switch>
    <Route element={<AppWrapper />}>
      <Route path="/" element={<LandingPage />} />

      <Route element={<ProtectedRoute roles={[Role.KABAL_SAKSBEHANDLING, Role.KABAL_ROL]} />}>
        <Route path="oppgaver" element={<OppgaverPage />} />
        <Route path="mineoppgaver" element={<MineOppgaverPage />} />
        <Route path="behandling/:oppgaveId" element={<OppgavebehandlingPage />} />

        <Route path="klagebehandling/:oppgaveId" element={<RedirectToBehandling />} />
        <Route path="ankebehandling/:oppgaveId" element={<RedirectToBehandling />} />
        <Route path="trygderettsankebehandling/:oppgaveId" element={<RedirectToBehandling />} />
        <Route path="behandling-etter-tr-opphevet/:oppgaveId" element={<RedirectToBehandling />} />
        <Route path="omgjøringskravbehandling/:oppgaveId" element={<RedirectToBehandling />} />
        <Route path="begjaering-om-gjenopptak-behandling/:oppgaveId" element={<RedirectToBehandling />} />
        <Route path="begjaering-om-gjenopptak-i-tr-behandling/:oppgaveId" element={<RedirectToBehandling />} />
      </Route>

      <Route element={<ProtectedRoute roles={[Role.KABAL_INNSYN_EGEN_ENHET, Role.KABAL_KROL]} />}>
        <Route path="oppgavestyring" element={<OppgavestyringPage />} />
      </Route>

      <Route
        element={
          <ProtectedRoute
            roles={[Role.KABAL_SAKSBEHANDLING, Role.KABAL_OPPGAVESTYRING_ALLE_ENHETER, Role.KABAL_KROL, Role.KABAL_ROL]}
          />
        }
      >
        <Route path="sok" element={<SearchPage />} />
      </Route>

      <Route element={<ProtectedRoute roles={[Role.KABAL_MALTEKSTREDIGERING]} />}>
        <Route
          path={`${TEXT_TYPE_BASE_PATH[MALTEKSTSEKSJON_TYPE]}/:lang/:id/versjoner/:maltekstseksjonVersionId/tekster/:textId`}
          element={<MaltekstseksjonerPage />}
        />
        <Route
          path={`${TEXT_TYPE_BASE_PATH[MALTEKSTSEKSJON_TYPE]}/:lang/:id/versjoner/:maltekstseksjonVersionId`}
          element={<MaltekstseksjonerPage />}
        />
        <Route path={`${TEXT_TYPE_BASE_PATH[MALTEKSTSEKSJON_TYPE]}/:lang/:id`} element={<MaltekstseksjonerPage />} />
        <Route path={`${TEXT_TYPE_BASE_PATH[MALTEKSTSEKSJON_TYPE]}/:lang`} element={<MaltekstseksjonerPage />} />
        <Route path={`${TEXT_TYPE_BASE_PATH[MALTEKSTSEKSJON_TYPE]}`} element={<MaltekstseksjonerPage />} />

        <Route
          path={`${TEXT_TYPE_BASE_PATH[RichTextTypes.MALTEKST]}/:lang/:id/versjoner/:versionId`}
          element={<MalteksterPage />}
        />
        <Route path={`${TEXT_TYPE_BASE_PATH[RichTextTypes.MALTEKST]}/:lang/:id`} element={<MalteksterPage />} />
        <Route path={`${TEXT_TYPE_BASE_PATH[RichTextTypes.MALTEKST]}/:lang`} element={<MalteksterPage />} />
        <Route path={`${TEXT_TYPE_BASE_PATH[RichTextTypes.MALTEKST]}`} element={<MalteksterPage />} />

        <Route
          path={`${TEXT_TYPE_BASE_PATH[RichTextTypes.REDIGERBAR_MALTEKST]}/:lang/:id/versjoner/:versionId`}
          element={<RedigerbareMalteksterPage />}
        />
        <Route
          path={`${TEXT_TYPE_BASE_PATH[RichTextTypes.REDIGERBAR_MALTEKST]}/:lang/:id`}
          element={<RedigerbareMalteksterPage />}
        />
        <Route
          path={`${TEXT_TYPE_BASE_PATH[RichTextTypes.REDIGERBAR_MALTEKST]}/:lang`}
          element={<RedigerbareMalteksterPage />}
        />
        <Route
          path={`${TEXT_TYPE_BASE_PATH[RichTextTypes.REDIGERBAR_MALTEKST]}`}
          element={<RedigerbareMalteksterPage />}
        />

        <Route
          path={`${TEXT_TYPE_BASE_PATH[PlainTextTypes.HEADER]}/:lang/:id/versjoner/:versionId`}
          element={<ToppteksterPage />}
        />
        <Route path={`${TEXT_TYPE_BASE_PATH[PlainTextTypes.HEADER]}/:lang/:id`} element={<ToppteksterPage />} />
        <Route path={`${TEXT_TYPE_BASE_PATH[PlainTextTypes.HEADER]}/:lang`} element={<ToppteksterPage />} />
        <Route path={`${TEXT_TYPE_BASE_PATH[PlainTextTypes.HEADER]}`} element={<ToppteksterPage />} />

        <Route
          path={`${TEXT_TYPE_BASE_PATH[PlainTextTypes.FOOTER]}/:lang/:id/versjoner/:versionId`}
          element={<BunnteksterPage />}
        />
        <Route path={`${TEXT_TYPE_BASE_PATH[PlainTextTypes.FOOTER]}/:lang/:id`} element={<BunnteksterPage />} />
        <Route path={`${TEXT_TYPE_BASE_PATH[PlainTextTypes.FOOTER]}/:lang`} element={<BunnteksterPage />} />
        <Route path={`${TEXT_TYPE_BASE_PATH[PlainTextTypes.FOOTER]}`} element={<BunnteksterPage />} />
      </Route>

      <Route element={<ProtectedRoute roles={[Role.KABAL_FAGTEKSTREDIGERING]} />}>
        <Route
          path={`${TEXT_TYPE_BASE_PATH[GOD_FORMULERING_TYPE]}/:lang/:id/versjoner/:versionId`}
          element={<GodeFormuleringerPage />}
        />
        <Route path={`${TEXT_TYPE_BASE_PATH[GOD_FORMULERING_TYPE]}/:lang/:id`} element={<GodeFormuleringerPage />} />
        <Route path={`${TEXT_TYPE_BASE_PATH[GOD_FORMULERING_TYPE]}/:lang`} element={<GodeFormuleringerPage />} />
        <Route path={`${TEXT_TYPE_BASE_PATH[GOD_FORMULERING_TYPE]}`} element={<GodeFormuleringerPage />} />

        <Route path={`${TEXT_TYPE_BASE_PATH[REGELVERK_TYPE]}/:id/versjoner/:versionId`} element={<RegelverkPage />} />
        <Route path={`${TEXT_TYPE_BASE_PATH[REGELVERK_TYPE]}/:id`} element={<RegelverkPage />} />
        <Route path={`${TEXT_TYPE_BASE_PATH[REGELVERK_TYPE]}`} element={<RegelverkPage />} />
      </Route>

      <Route element={<ProtectedRoute roles={[Role.KABAL_SVARBREVINNSTILLINGER]} />}>
        <Route path="svarbrev">
          <Route index element={<SvarbrevPage />} />
          <Route path=":id" element={<SvarbrevPage modal={ModalEnum.PREVIEW} />} />
          <Route path=":id/historikk" element={<SvarbrevPage modal={ModalEnum.HISTORY} />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute roles={[Role.KABAL_TILGANGSSTYRING_EGEN_ENHET]} />}>
        <Route path="tilgangsstyring" element={<AccessRightsPage />} />
      </Route>

      <Route element={<ProtectedRoute roles={[Role.KABAL_ADMIN]} />}>
        <Route path="admin" element={<AdminPage />} />
      </Route>

      <Route path="innstillinger" element={<SettingsPage />} />

      <Route path="*" element={<NotFoundPage />} />
    </Route>
  </Switch>
);

const AppWrapper = () => {
  const theme = useAppTheme();

  return (
    <Theme theme={theme} className="h-full w-full">
      <VStack height="100%" width="100%" overflow="hidden">
        <NavHeader />
        <Outlet />
        <Toasts />
        <VersionCheckerStatus />
      </VStack>
    </Theme>
  );
};
