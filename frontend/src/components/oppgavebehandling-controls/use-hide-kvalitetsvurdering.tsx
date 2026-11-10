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

export const useKvalitetsvurderingSupported = (oppgave: IOppgavebehandling): Supported => {
  const { user } = useContext(StaticDataContext);

  const { typeId, resultat } = oppgave;

  // Manual override for testing. Remove when BE is ready.
  if (
    typeId === SaksTypeEnum.ANKE_AFTER_2027 ||
    typeId === SaksTypeEnum.ANKE_I_TRYGDERETTEN_AFTER_2027 ||
    typeId === SaksTypeEnum.ANKE_I_TRYGDERETTEN
  ) {
    return { panelDefaultEnabled: true, featureEnabled: true, reason: null };
  }

  if (!typeHasKvalitetsvurdering(typeId)) {
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

  if (!utfallHasKvalitetsvurdering(resultat.utfallId, typeId)) {
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

export const typeHasKvalitetsvurdering = (typeId: SaksTypeEnum): boolean =>
  typeId === SaksTypeEnum.KLAGE ||
  typeId === SaksTypeEnum.ANKE ||
  typeId === SaksTypeEnum.ANKE_I_TRYGDERETTEN ||
  typeId === SaksTypeEnum.ANKE_AFTER_2027 ||
  typeId === SaksTypeEnum.ANKE_I_TRYGDERETTEN_AFTER_2027;

export const utfallHasKvalitetsvurdering = (utfallId: UtfallEnum | null, typeId: SaksTypeEnum): boolean => {
  if (
    typeId === SaksTypeEnum.ANKE_AFTER_2027 ||
    typeId === SaksTypeEnum.ANKE_I_TRYGDERETTEN_AFTER_2027 ||
    typeId === SaksTypeEnum.ANKE_I_TRYGDERETTEN
  ) {
    return true;
  }

  return utfallId !== UtfallEnum.TRUKKET && utfallId !== UtfallEnum.RETUR && utfallId !== UtfallEnum.HENLAGT;
};
