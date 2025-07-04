import { useCanEditBehandling } from '@app/hooks/use-can-edit';
import { useIsFeilregistrert } from '@app/hooks/use-is-feilregistrert';

export const useHasDocumentsAccess = (): boolean => {
  const canEdit = useCanEditBehandling();
  const isFeilregistrert = useIsFeilregistrert();

  if (isFeilregistrert) {
    return false;
  }

  return canEdit;
};
