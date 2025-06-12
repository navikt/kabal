import { useOppgave } from './oppgavebehandling/use-oppgave';

export const useLazyIsFullfoert = () => {
  const { data, isSuccess } = useOppgave();

  return () => isSuccess && data.isAvsluttetAvSaksbehandler;
};

export const useIsFullfoert = (): boolean => {
  const isLazyFullfoert = useLazyIsFullfoert();

  return isLazyFullfoert();
};
