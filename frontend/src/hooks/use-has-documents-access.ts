import { useLazyIsTildelt } from '@app/hooks/oppgavebehandling/use-is-tildelt';
import { useCanEditBehandling } from '@app/hooks/use-can-edit';
import { useIsFeilregistrert, useLazyIsFeilregistrert } from '@app/hooks/use-is-feilregistrert';
import { useIsFullfoert, useLazyIsFullfoert } from '@app/hooks/use-is-fullfoert';
import { useLazyIsSentToMedunderskriver } from '@app/hooks/use-is-medunderskriver';
import { useIsRolOrKrolUser } from '@app/hooks/use-is-rol';
import { useIsSaksbehandler, useLazyIsTildeltSaksbehandler } from '@app/hooks/use-is-saksbehandler';
import { DocumentTypeEnum, type IMainDocument } from '@app/types/documents/documents';

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

export const useHasArchiveAccess = (document: IMainDocument): boolean => {
  const isTildelt = useLazyIsTildelt();
  const isTildeltSaksbehandler = useLazyIsTildeltSaksbehandler();
  const isSentToMedunderskriver = useLazyIsSentToMedunderskriver();
  const isFullfoert = useLazyIsFullfoert();
  const isFeilregistrert = useLazyIsFeilregistrert();
  const isRolOrKrol = useIsRolOrKrolUser();

  if (isRolOrKrol || isFeilregistrert()) {
    // Feilregistrert cases cannot archive documents.
    // ROL and KROL users can never archive documents.
    return false;
  }

  if (isFullfoert() || document.type === DocumentTypeEnum.UPLOADED) {
    // Anyone, except ROL/KROL, can archive documents that are uploaded.
    // Anyone, except ROL/KROL, can archive documents on completed cases.
    return true;
  }

  if (isTildelt()) {
    // If the case is assigned, only the assigned saksbehandler can archive.
    return isTildeltSaksbehandler();
  }

  if (isSentToMedunderskriver()) {
    // If the case is sent to medunderskriver, no one can archive documents.
    return false;
  }

  // If the case is not assigned, and not sent to medunderskriver, anyone can archive.
  return true;
};
