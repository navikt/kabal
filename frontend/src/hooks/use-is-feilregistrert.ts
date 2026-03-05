import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import type { IFeilregistrering } from '@app/types/oppgavebehandling/oppgavebehandling';

export const useLazyIsFeilregistrert = () => {
  const { data, isSuccess } = useOppgave();

  return () => isSuccess && getIsFeilregistrert(data.feilregistrering);
};

export const useIsFeilregistrert = (): boolean => {
  const isLazyFeilregistrert = useLazyIsFeilregistrert();

  return isLazyFeilregistrert();
};

export const getIsFeilregistrert = (feilregistrering: IFeilregistrering | null): boolean => feilregistrering !== null;
