import { treatAsArena } from '@/domain/arena-case';
import { useOppgave } from '@/hooks/oppgavebehandling/use-oppgave';
import { isAnkeTypeAfter2027, SaksTypeEnum } from '@/types/kodeverk';

export const getFixedCacheKey = (oppgaveId: string) => `medunderskriver-cache-key-${oppgaveId}`;

// Only show Arena warning stuff for so-called fake cases in Arena:
// https://nav-it.slack.com/archives/G01CTUC8LSU/p1782466579021549
export const useIsFakeArenaCase = () => {
  const { data: oppgave } = useOppgave();

  if (oppgave === undefined) {
    return false;
  }

  const { fagsystemId, typeId, requiresGosysOppgave } = oppgave;

  return (
    treatAsArena(fagsystemId, requiresGosysOppgave) &&
    (typeId === SaksTypeEnum.KLAGE ||
      typeId === SaksTypeEnum.ANKE ||
      typeId === SaksTypeEnum.BEHANDLING_ETTER_TR_OPPHEVET ||
      typeId === SaksTypeEnum.ANKE_I_TRYGDERETTEN ||
      isAnkeTypeAfter2027(typeId))
  );
};
