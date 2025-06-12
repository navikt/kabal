import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';

export const useLazyIsTildelt = () => {
  const { data, isSuccess } = useOppgave();

  return () => isSuccess && getIsTildelt(data.saksbehandler);
};

export const useIsTildelt = (): boolean => {
  const isLazyTildelt = useLazyIsTildelt();

  return isLazyTildelt();
};

export const getIsTildelt = (saksbehandler: { navIdent: string } | null): boolean => saksbehandler !== null;
