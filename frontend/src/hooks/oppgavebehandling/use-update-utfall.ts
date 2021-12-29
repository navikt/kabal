import { useUpdateUtfallMutation } from '../../redux-api/oppgavebehandling';

export const useUpdateUtfall = (): ReturnType<typeof useUpdateUtfallMutation> => {
  const [updateUtfall, oppgave] = useUpdateUtfallMutation();

  return [updateUtfall, oppgave];
};
