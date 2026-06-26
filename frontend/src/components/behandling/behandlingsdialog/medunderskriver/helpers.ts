import { FAGSYSTEM_ARENA } from '@/components/oppgavebehandling-footer/fagsystem';
import { useOppgave } from '@/hooks/oppgavebehandling/use-oppgave';
import { SaksTypeEnum } from '@/types/kodeverk';

export const getFixedCacheKey = (oppgaveId: string) => `medunderskriver-cache-key-${oppgaveId}`;

// Only show Arena warning stuff for so-called fake cases in Arena:
// https://nav-it.slack.com/archives/G01CTUC8LSU/p1782466579021549
export const useIsFakeArenaCase = () => {
  const { data: oppgave } = useOppgave();

  if (oppgave === undefined) {
    return false;
  }

  const { fagsystemId, typeId } = oppgave;

  return (
    fagsystemId === FAGSYSTEM_ARENA &&
    (typeId === SaksTypeEnum.KLAGE ||
      typeId === SaksTypeEnum.ANKE ||
      typeId === SaksTypeEnum.BEHANDLING_ETTER_TR_OPPHEVET ||
      typeId === SaksTypeEnum.ANKE_I_TRYGDERETTEN)
  );
};
