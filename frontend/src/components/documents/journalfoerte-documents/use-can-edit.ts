import { useHasDocumentsAccess } from '@app/hooks/use-has-documents-access';
import { useIsAssignedRolAndSent } from '@app/hooks/use-is-rol';

export const useCanEditDocument = () => {
  const isRol = useIsAssignedRolAndSent();
  const hasDocumentsAccess = useHasDocumentsAccess();

  return hasDocumentsAccess || isRol;
};
