import { useCanEditBehandling } from '@app/hooks/use-can-edit';
import { useIsFeilregistrert } from '@app/hooks/use-is-feilregistrert';
import { useIsFullfoert } from '@app/hooks/use-is-fullfoert';
import { useIsRolOrKrolUser } from '@app/hooks/use-is-rol';
import { useIsSaksbehandler } from '@app/hooks/use-is-saksbehandler';

export const useHasDocumentsAccess = (): boolean => {
  const isFullfoert = useIsFullfoert();
  const isSaksbehandler = useIsSaksbehandler();
  const canEdit = useCanEditBehandling();
  const isFeilregistrert = useIsFeilregistrert();

  if (isFeilregistrert) {
    return false;
  }

  if (isFullfoert) {
    return isSaksbehandler;
  }

  return canEdit;
};

export const useHasUploadAccess = (): boolean => {
  const isFeilregistrert = useIsFeilregistrert(); // Feilregistrert cases cannot upload documents.
  const isRolOrKrol = useIsRolOrKrolUser(); // ROL and KROL users cannot upload documents.

  return !isFeilregistrert && !isRolOrKrol;
};
