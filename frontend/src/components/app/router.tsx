import { useAppTheme } from '@app/app-theme';
import { NotFoundPage } from '@app/components/app/not-found-page';
import { ProtectedRoute } from '@app/components/app/protected-route';
import { NavHeader } from '@app/components/header/header';
import { ModalEnum } from '@app/components/svarbrev/row/row';
import { Toasts } from '@app/components/toast/toasts';
import { VersionCheckerStatus } from '@app/components/version-checker/version-checker-status';
import { TEXT_TYPE_BASE_PATH } from '@app/domain/redaktør-paths';
import { AccessRightsPage } from '@app/pages/access-rights/access-rights';
import { AdminPage } from '@app/pages/admin/admin';
import { BunnteksterPage } from '@app/pages/bunntekster/bunntekster';
import { GodeFormuleringerPage } from '@app/pages/gode-formuleringer/gode-formuleringer';
import { LandingPage } from '@app/pages/landing-page/landing-page';
import { MalteksterPage } from '@app/pages/maltekster/maltekster';
import { MaltekstseksjonerPage } from '@app/pages/maltekstseksjoner/maltekstseksjoner';
import { MineOppgaverPage } from '@app/pages/mine-oppgaver/mine-oppgaver';
import { OppgavebehandlingPage } from '@app/pages/oppgavebehandling/oppgavebehandling';
import { OppgaverPage } from '@app/pages/oppgaver/oppgaver';
import { OppgavestyringPage } from '@app/pages/oppgavestyring/oppgavestyring';
import { RedigerbareMalteksterPage } from '@app/pages/redigerbare-maltekster/redigerbare-maltekster';
import { RegelverkPage } from '@app/pages/regelverk/regelverk';
import { SearchPage } from '@app/pages/search/search';
import { SettingsPage } from '@app/pages/settings/settings';
import { SvarbrevPage } from '@app/pages/svarbrev/svarbrev';
import { ToppteksterPage } from '@app/pages/topptekster/topptekster';
import { Role } from '@app/types/bruker';
import {
  GOD_FORMULERING_TYPE,
  MALTEKSTSEKSJON_TYPE,
  PlainTextTypes,
  REGELVERK_TYPE,
  RichTextTypes,
} from '@app/types/common-text-types';
import { Theme, VStack } from '@navikt/ds-react';
import { Navigate, Outlet, Route, Routes as Switch, useParams } from 'react-router-dom';

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
