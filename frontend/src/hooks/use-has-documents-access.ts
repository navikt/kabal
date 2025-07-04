import { useCanEditBehandling } from '@app/hooks/use-can-edit';
import { useIsFeilregistrert } from '@app/hooks/use-is-feilregistrert';
import { useIsRolOrKrolUser } from '@app/hooks/use-is-rol';

export const useHasDocumentsAccess = (): boolean => {
  const canEdit = useCanEditBehandling();
  const isFeilregistrert = useIsFeilregistrert();

  if (isFeilregistrert) {
    return false;
  }

  return canEdit;
};

export const useHasUploadAccess = (): boolean => {
  const isFeilregistrert = useIsFeilregistrert(); // Feilregistrert cases cannot upload documents.
  const isRolOrKrol = useIsRolOrKrolUser(); // ROL and KROL users cannot upload documents.

  return !isFeilregistrert && !isRolOrKrol;
};
