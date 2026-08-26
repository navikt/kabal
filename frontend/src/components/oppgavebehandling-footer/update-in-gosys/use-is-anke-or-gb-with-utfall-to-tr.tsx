import { useOppgave } from '@/hooks/oppgavebehandling/use-oppgave';
import { SaksTypeEnum, UtfallEnum } from '@/types/kodeverk';

// https://nav-it.slack.com/archives/G01CTUC8LSU/p1786700361118939
export const useIsAnkeOrGbWithUtfallToTr = () => {
  const { data, isSuccess } = useOppgave();

  if (!isSuccess) {
    return false;
  }

  const { typeId, resultat } = data;
  const { utfallId } = resultat;

  if (typeId !== SaksTypeEnum.ANKE && typeId !== SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK) {
    return false;
  }

  return (
    utfallId === UtfallEnum.DELVIS_MEDHOLD ||
    utfallId === UtfallEnum.INNSTILLING_AVVIST ||
    utfallId === UtfallEnum.INNSTILLING_GJENOPPTAS ||
    utfallId === UtfallEnum.INNSTILLING_STADFESTELSE ||
    utfallId === UtfallEnum.INNSTILLING_IKKE_GJENOPPTAS
  );
};
