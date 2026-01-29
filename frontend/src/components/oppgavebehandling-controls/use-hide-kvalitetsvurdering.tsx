import { StaticDataContext } from '@app/components/app/static-data-context';
import { Type } from '@app/components/type/type';
import { UtfallTag } from '@app/components/utfall-tag/utfall-tag';
import { SaksTypeEnum, UtfallEnum } from '@app/types/kodeverk';
import type { IOppgavebehandling } from '@app/types/oppgavebehandling/oppgavebehandling';
import { type ReactElement, useContext } from 'react';

type Supported =
  | { featureEnabled: true; panelDefaultEnabled: true; reason: null } // Kvalitetsvurdering supported
  | { featureEnabled: true; panelDefaultEnabled: boolean; reason: ReactElement } // Kvalitetsvurdering not supported with reason
  | { featureEnabled: false; panelDefaultEnabled: false; reason: null }; // Completely hide kvalitetsvurdering - don't even show reason

export const useKvalitetsvurderingSupported = (oppgave: IOppgavebehandling): Supported => {
  const { user } = useContext(StaticDataContext);

  const { typeId, resultat } = oppgave;

  if (
    typeId === SaksTypeEnum.ANKE_I_TRYGDERETTEN ||
    typeId === SaksTypeEnum.BEHANDLING_ETTER_TR_OPPHEVET ||
    typeId === SaksTypeEnum.OMGJØRINGSKRAV ||
    typeId === SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK ||
    typeId === SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK_I_TR
  ) {
    return {
      featureEnabled: true,
      panelDefaultEnabled: false,
      reason: (
        <>
          Du skal ikke gjøre kvalitetsvurdering for sakstype <Type type={typeId} />
        </>
      ),
    };
  }

  if (
    resultat.utfallId === UtfallEnum.TRUKKET ||
    resultat.utfallId === UtfallEnum.RETUR ||
    resultat.utfallId === UtfallEnum.UGUNST ||
    resultat.utfallId === UtfallEnum.HENLAGT
  ) {
    return {
      featureEnabled: true,
      panelDefaultEnabled: true,
      reason: (
        <>
          Du skal ikke gjøre kvalitetsvurdering fordi utfallet er satt til <UtfallTag utfallId={resultat.utfallId} />
        </>
      ),
    };
  }

  if (
    oppgave.kvalitetsvurderingReference === null ||
    oppgave.rol.employee?.navIdent === user.navIdent ||
    oppgave.feilregistrering !== null
  ) {
    return { featureEnabled: false, panelDefaultEnabled: false, reason: null };
  }

  return { panelDefaultEnabled: true, featureEnabled: true, reason: null };
};
