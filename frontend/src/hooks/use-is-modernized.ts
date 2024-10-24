import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useFagsystemer } from '@app/simple-api-state/use-kodeverk';

export const useIsModernized = (): boolean => {
  const { data: oppgave } = useOppgave();
  const { data: fagsystemer = [] } = useFagsystemer();

  const fagsystem = oppgave?.fagsystemId;

  return fagsystemer.find(({ id }) => id === fagsystem)?.modernized ?? false;
};
