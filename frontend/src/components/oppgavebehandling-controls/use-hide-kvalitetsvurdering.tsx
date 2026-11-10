import { type ReactElement, useContext } from 'react';
import { StaticDataContext } from '@/components/app/static-data-context';
import { Type } from '@/components/type/type';
import { UtfallTag } from '@/components/utfall-tag/utfall-tag';
import { SaksTypeEnum, UtfallEnum } from '@/types/kodeverk';
import type { IOppgavebehandling } from '@/types/oppgavebehandling/oppgavebehandling';

type Supported =
  | { featureEnabled: true; panelDefaultEnabled: true; reason: null } // Kvalitetsvurdering supported
  | { featureEnabled: true; panelDefaultEnabled: boolean; reason: ReactElement } // Kvalitetsvurdering not supported with reason
  | { featureEnabled: false; panelDefaultEnabled: false; reason: null }; // Completely hide kvalitetsvurdering - don't even show reason

enum Policy {
  REQUIRED = 'REQUIRED',
  NOT_REQUIRED_FOR_SAKSTYPE = 'NOT_REQUIRED_FOR_SAKSTYPE',
  NOT_REQUIRED_FOR_UTFALL = 'NOT_REQUIRED_FOR_UTFALL',
}

export const useKvalitetsvurderingSupported = (oppgave: IOppgavebehandling): Supported => {
  const { user } = useContext(StaticDataContext);

  const { typeId, resultat } = oppgave;
  const status = getKvalitetsvurderingStatus(typeId, resultat.utfallId);

  // Manual test override until BE has support for kvalitetsvurdering for these sakstyper
  if (
    typeId === SaksTypeEnum.ANKE_AFTER_2027 ||
    typeId === SaksTypeEnum.ANKE_I_TRYGDERETTEN_AFTER_2027 ||
    typeId === SaksTypeEnum.ANKE_I_TRYGDERETTEN ||
    typeId === SaksTypeEnum.ANKE
  ) {
    return {
      featureEnabled: true,
      panelDefaultEnabled: true,
      reason: null,
    };
  }

  if (status === Policy.NOT_REQUIRED_FOR_SAKSTYPE) {
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

  if (status === Policy.NOT_REQUIRED_FOR_UTFALL) {
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

export const hasKvalitetsvurdering = (typeId: SaksTypeEnum, utfallId: UtfallEnum | null): boolean =>
  getKvalitetsvurderingStatus(typeId, utfallId) === Policy.REQUIRED;

const getKvalitetsvurderingStatus = (typeId: SaksTypeEnum, utfallId: UtfallEnum | null): Policy => {
  switch (typeId) {
    case SaksTypeEnum.ANKE_AFTER_2027:
    case SaksTypeEnum.ANKE_I_TRYGDERETTEN_AFTER_2027:
    case SaksTypeEnum.ANKE_I_TRYGDERETTEN:
      return Policy.REQUIRED;
    case SaksTypeEnum.KLAGE:
    case SaksTypeEnum.ANKE:
      return utfallId === UtfallEnum.TRUKKET || utfallId === UtfallEnum.RETUR || utfallId === UtfallEnum.HENLAGT
        ? Policy.NOT_REQUIRED_FOR_UTFALL
        : Policy.REQUIRED;
    case SaksTypeEnum.BEHANDLING_ETTER_TR_OPPHEVET:
    case SaksTypeEnum.OMGJØRINGSKRAV:
    case SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK:
    case SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK_I_TR:
    case SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK_AFTER_2027:
    case SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK_I_TR_AFTER_2027:
      return Policy.NOT_REQUIRED_FOR_SAKSTYPE;
  }
};
