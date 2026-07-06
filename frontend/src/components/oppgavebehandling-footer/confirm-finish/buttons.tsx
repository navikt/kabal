import {
  NyBehandlingButtonGroup,
  SimpleButtonGroup,
  StandardButtonGroup,
  TrygderettenHenvistButtonGroup,
  TrygderettenOpphevetButtonGroup,
} from '@/components/oppgavebehandling-footer/confirm-finish/button-groups';
import type { ButtonsProps } from '@/components/oppgavebehandling-footer/confirm-finish/types';
import { useOppgave } from '@/hooks/oppgavebehandling/use-oppgave';
import { SaksTypeEnum, UtfallEnum } from '@/types/kodeverk';

export const Buttons = ({ cancel, finishDisabled }: ButtonsProps) => {
  const { data: oppgave } = useOppgave();

  if (oppgave === undefined) {
    return null;
  }

  const { typeId, resultat, requiresGosysOppgave } = oppgave;
  const { utfallId } = resultat;

  switch (typeId) {
    case SaksTypeEnum.KLAGE:
    case SaksTypeEnum.ANKE:
    case SaksTypeEnum.BEHANDLING_ETTER_TR_OPPHEVET:
      return (
        <StandardButtonGroup
          cancel={cancel}
          finishDisabled={finishDisabled}
          requiresGosysOppgave={requiresGosysOppgave}
        />
      );

    case SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK:
      switch (utfallId) {
        case UtfallEnum.TRUKKET:
        case UtfallEnum.HENLAGT:
          return <SimpleButtonGroup cancel={cancel} finishDisabled={finishDisabled} />;
        default:
          return (
            <StandardButtonGroup
              cancel={cancel}
              finishDisabled={finishDisabled}
              requiresGosysOppgave={requiresGosysOppgave}
            />
          );
      }

    case SaksTypeEnum.OMGJØRINGSKRAV:
      switch (utfallId) {
        case UtfallEnum.MEDHOLD_ETTER_FORVALTNINGSLOVEN_35:
          return (
            <StandardButtonGroup
              cancel={cancel}
              finishDisabled={finishDisabled}
              requiresGosysOppgave={requiresGosysOppgave}
            />
          );
        default:
          return <SimpleButtonGroup cancel={cancel} finishDisabled={finishDisabled} />;
      }

    case SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK_I_TR:
      switch (utfallId) {
        case UtfallEnum.GJENOPPTATT_OPPHEVET:
          return (
            <NyBehandlingButtonGroup
              cancel={cancel}
              finishDisabled={finishDisabled}
              requiresGosysOppgave={requiresGosysOppgave}
            />
          );
        case UtfallEnum.HEVET:
        case UtfallEnum.IKKE_GJENOPPTATT:
        case UtfallEnum.AVVIST:
        case UtfallEnum.GJENOPPTATT_STADFESTET:
          return <SimpleButtonGroup cancel={cancel} finishDisabled={finishDisabled} />;
        default:
          return (
            <StandardButtonGroup
              cancel={cancel}
              finishDisabled={finishDisabled}
              requiresGosysOppgave={requiresGosysOppgave}
            />
          );
      }

    case SaksTypeEnum.ANKE_I_TRYGDERETTEN:
      switch (utfallId) {
        case UtfallEnum.MEDHOLD:
        case UtfallEnum.DELVIS_MEDHOLD:
        case UtfallEnum.STADFESTELSE:
        case UtfallEnum.AVVIST:
        case UtfallEnum.HEVET:
          return (
            <StandardButtonGroup
              cancel={cancel}
              finishDisabled={finishDisabled}
              requiresGosysOppgave={requiresGosysOppgave}
            />
          );
        case UtfallEnum.OPPHEVET:
          return (
            <TrygderettenOpphevetButtonGroup
              cancel={cancel}
              finishDisabled={finishDisabled}
              requiresGosysOppgave={requiresGosysOppgave}
            />
          );
        case UtfallEnum.HENVIST:
          return <TrygderettenHenvistButtonGroup cancel={cancel} finishDisabled={finishDisabled} />;
      }
  }
};
