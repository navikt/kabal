import type { IFeilregistrering } from '@app/types/oppgavebehandling/oppgavebehandling';
import { useOppgave } from './oppgavebehandling/use-oppgave';

export const useLazyIsFeilregistrert = () => {
  const { data, isSuccess } = useOppgave();

  return () => isSuccess && getIsFeilregistrert(data.feilregistrering);
};

export const useIsFeilregistrert = (): boolean => {
  const isLazyFeilregistrert = useLazyIsFeilregistrert();

  return isLazyFeilregistrert();
};

export const getIsFeilregistrert = (feilregistrering: IFeilregistrering | null): boolean => feilregistrering !== null;
