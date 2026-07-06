import { useOppgave } from '@/hooks/oppgavebehandling/use-oppgave';
import { SaksTypeEnum, UtfallEnum } from '@/types/kodeverk';

export const useText = (): string => {
  const { data: oppgave } = useOppgave();

  if (oppgave === undefined) {
    return '';
  }

  const { typeId, resultat } = oppgave;
  const { utfallId } = resultat;

  switch (typeId) {
    case SaksTypeEnum.KLAGE:
      return 'Du fullfører nå klagebehandlingen. Klagebehandlingen kan ikke redigeres når den er fullført. Bekreft at du faktisk ønsker å fullføre behandlingen.';
    case SaksTypeEnum.ANKE: {
      if (utfallId === UtfallEnum.MEDHOLD || utfallId === UtfallEnum.OPPHEVET) {
        return 'Du fullfører nå ankebehandlingen. Ankebehandlingen kan ikke redigeres når den er fullført. Bekreft at du faktisk ønsker å fullføre behandlingen.';
      }

      if (utfallId === UtfallEnum.INNSTILLING_STADFESTELSE || utfallId === UtfallEnum.INNSTILLING_AVVIST) {
        return 'Bekreft at du har gjennomført overføring til Trygderetten før du fullfører behandlingen i Kabal. Ankebehandlingen kan ikke redigeres når den er fullført.';
      }

      if (utfallId === UtfallEnum.DELVIS_MEDHOLD) {
        return 'Bekreft at du har gjennomført overføring til Trygderetten for den delen av saken du ikke har omgjort, før du fullfører behandlingen i Kabal. Ankebehandlingen kan ikke redigeres når den er fullført.';
      }

      return 'Du fullfører nå ankebehandlingen. Ankebehandlingen kan ikke redigeres når den er fullført. Bekreft at du faktisk ønsker å fullføre behandlingen.';
    }
    case SaksTypeEnum.ANKE_I_TRYGDERETTEN: {
      if (utfallId === UtfallEnum.HENVIST) {
        return 'Du har valgt «henvist» som resultat fra Trygderetten. Du fullfører nå registrering av resultatet. Når du trykker «Fullfør», vil Kabal opprette en ny ankeoppgave som du skal behandle. Vær oppmerksom på at det kan ta noen minutter før ankebehandlingen er opprettet.';
      }

      if (utfallId === UtfallEnum.OPPHEVET) {
        return 'Du har valgt «opphevet» som resultat fra Trygderetten. Du fullfører nå registrering av resultatet. Skal klageinstansen behandle saken på nytt?';
      }

      return 'Du fullfører nå registrering av utfall/resultat fra Trygderetten. Registreringen kan ikke redigeres når den er fullført. Bekreft at du faktisk ønsker å fullføre registreringen.';
    }
    case SaksTypeEnum.BEHANDLING_ETTER_TR_OPPHEVET:
      return 'Du fullfører nå behandlingen. Behandlingen kan ikke redigeres når den er fullført. Bekreft at du faktisk ønsker å fullføre behandlingen.';
    case SaksTypeEnum.OMGJØRINGSKRAV:
      return 'Du fullfører nå behandlingen av omgjøringskravet. Behandlingen kan ikke redigeres når den er fullført. Bekreft at du faktisk ønsker å fullføre behandlingen.';
    case SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK: {
      if (
        utfallId === UtfallEnum.INNSTILLING_GJENOPPTAS ||
        utfallId === UtfallEnum.INNSTILLING_IKKE_GJENOPPTAS ||
        utfallId === UtfallEnum.INNSTILLING_AVVIST
      ) {
        return 'Bekreft at du har gjennomført overføring til Trygderetten, før du fullfører behandlingen av begjæringen om gjenopptak i Kabal. Behandlingen kan ikke redigeres når den er fullført.';
      }

      return 'Du fullfører nå behandlingen av begjæringen om gjenopptak. Behandlingen kan ikke redigeres når den er fullført. Bekreft at du faktisk ønsker å fullføre behandlingen.';
    }
    case SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK_I_TR:
      if (utfallId === UtfallEnum.GJENOPPTATT_OPPHEVET) {
        return 'Du har valgt «opphevet» som resultat fra Trygderetten. Du fullfører nå registrering av resultatet. Skal klageinstansen behandle saken på nytt?';
      }

      return 'Du fullfører nå registrering av utfall/resultat fra Trygderetten. Registreringen kan ikke redigeres når den er fullført. Bekreft at du faktisk ønsker å fullføre registreringen.';
  }
};
