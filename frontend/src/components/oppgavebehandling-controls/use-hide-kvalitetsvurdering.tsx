import { type ReactElement, useContext } from 'react';
import { StaticDataContext } from '@/components/app/static-data-context';
import { Type } from '@/components/type/type';
import { UtfallTag } from '@/components/utfall-tag/utfall-tag';
import { useOppgave } from '@/hooks/oppgavebehandling/use-oppgave';
import { SaksTypeEnum, UtfallEnum } from '@/types/kodeverk';
import { isKakaKvalitetsvurdering, isKantKvalitetsvurdering } from '@/types/kvalitetsvurdering/common';

const NOT_APPLICABLE: Supported = { featureEnabled: false, panelDefaultEnabled: false, reason: null };

type Supported =
  | { featureEnabled: true; panelDefaultEnabled: true; reason: null } // Kvalitetsvurdering supported
  | { featureEnabled: true; panelDefaultEnabled: boolean; reason: ReactElement } // Kvalitetsvurdering not supported with reason
  | { featureEnabled: false; panelDefaultEnabled: false; reason: null }; // Completely hide kvalitetsvurdering - don't even show reason

enum Policy {
  REQUIRED = 'REQUIRED',
  NOT_REQUIRED_FOR_SAKSTYPE = 'NOT_REQUIRED_FOR_SAKSTYPE',
  NOT_REQUIRED_FOR_UTFALL = 'NOT_REQUIRED_FOR_UTFALL',
  NOT_APPLICABLE = 'NOT_APPLICABLE',
}

export const useKvalitetsvurderingSupported = (): Supported => {
  const { data: oppgave, isSuccess } = useOppgave();

  const policy = useKvalitetsvurderingPolicy();

  if (!isSuccess) {
    return NOT_APPLICABLE;
  }

  const { typeId, resultat } = oppgave;

  switch (policy) {
    case Policy.NOT_APPLICABLE:
      return NOT_APPLICABLE;
    case Policy.NOT_REQUIRED_FOR_SAKSTYPE:
      return {
        featureEnabled: true,
        panelDefaultEnabled: false,
        reason: (
          <>
            Du skal ikke gjøre kvalitetsvurdering for sakstype <Type type={typeId} />
          </>
        ),
      };
    case Policy.NOT_REQUIRED_FOR_UTFALL:
      return {
        featureEnabled: true,
        panelDefaultEnabled: true,
        reason: (
          <>
            Du skal ikke gjøre kvalitetsvurdering fordi utfallet er satt til <UtfallTag utfallId={resultat.utfallId} />
          </>
        ),
      };
    case Policy.REQUIRED:
      return { panelDefaultEnabled: true, featureEnabled: true, reason: null };
  }
};

export const useHasKvalitetsvurdering = (): boolean => useKvalitetsvurderingPolicy() === Policy.REQUIRED;

const useKvalitetsvurderingPolicy = (): Policy => {
  const { user } = useContext(StaticDataContext);
  const { data: behandling, isSuccess } = useOppgave();

  if (!isSuccess) {
    return Policy.NOT_APPLICABLE;
  }

  const {
    typeId,
    resultat: { utfallId },
  } = behandling;

  if (behandling.rol.employee?.navIdent === user.navIdent || behandling.feilregistrering !== null) {
    return Policy.NOT_APPLICABLE;
  }

  if (
    typeId === SaksTypeEnum.BEHANDLING_ETTER_TR_OPPHEVET ||
    typeId === SaksTypeEnum.OMGJØRINGSKRAV ||
    typeId === SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK ||
    typeId === SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK_I_TR ||
    typeId === SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK_AFTER_2027 ||
    typeId === SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK_I_TR_AFTER_2027
  ) {
    return Policy.NOT_REQUIRED_FOR_SAKSTYPE;
  }

  if (!isKakaKvalitetsvurdering(behandling) && !isKantKvalitetsvurdering(behandling)) {
    return Policy.NOT_APPLICABLE;
  }

  switch (typeId) {
    case SaksTypeEnum.ANKE_AFTER_2027:
    case SaksTypeEnum.ANKE_I_TRYGDERETTEN_AFTER_2027:
    case SaksTypeEnum.ANKE_I_TRYGDERETTEN:
      return Policy.REQUIRED;
    case SaksTypeEnum.KLAGE:
    case SaksTypeEnum.ANKE:
      if (isKantKvalitetsvurdering(behandling)) {
        return Policy.REQUIRED;
      }

      return utfallId === UtfallEnum.TRUKKET || utfallId === UtfallEnum.RETUR || utfallId === UtfallEnum.HENLAGT
        ? Policy.NOT_REQUIRED_FOR_UTFALL
        : Policy.REQUIRED;
  }
};
