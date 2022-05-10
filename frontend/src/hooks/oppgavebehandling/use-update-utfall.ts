import { useUpdateUtfallMutation } from '../../redux-api/oppgaver/mutations/set-utfall';

export const useUpdateUtfall = (): ReturnType<typeof useUpdateUtfallMutation> => {
  const [updateUtfall, oppgave] = useUpdateUtfallMutation();

  return [updateUtfall, oppgave];
};
