import { useHasDocumentsAccess } from '@app/hooks/use-has-documents-access';
import { useIsRol } from '@app/hooks/use-is-rol';

export const useCanEditDocument = () => {
  const isRol = useIsRol();
  const hasDocumentsAccess = useHasDocumentsAccess();

  return hasDocumentsAccess || isRol;
};
