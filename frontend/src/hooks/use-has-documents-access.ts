import { useIsTildelt } from '@app/hooks/oppgavebehandling/use-is-tildelt';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useCanEditBehandling } from '@app/hooks/use-can-edit';
import { useHasRole } from '@app/hooks/use-has-role';
import { useIsFeilregistrert } from '@app/hooks/use-is-feilregistrert';
import { useIsFullfoert } from '@app/hooks/use-is-fullfoert';
import { useIsSaksbehandler } from '@app/hooks/use-is-saksbehandler';
import { Role } from '@app/types/bruker';
import { DocumentTypeEnum, type IMainDocument } from '@app/types/documents/documents';
import { FlowState } from '@app/types/oppgave-common';

export const useHasDocumentsAccess = (): boolean => {
  const isFullfoert = useIsFullfoert();
  const hasSaksbehandlerRole = useHasRole(Role.KABAL_SAKSBEHANDLING);
  const canEdit = useCanEditBehandling();
  const isFeilregistrert = useIsFeilregistrert();

  if (isFeilregistrert) {
    return false;
  }

  if (isFullfoert) {
    return hasSaksbehandlerRole;
  }

  return canEdit;
};

export const useHasUploadAccess = (): boolean => !useIsFeilregistrert();

export const useHasArchiveAccess = (document: IMainDocument): boolean => {
  const isFullfoert = useIsFullfoert();
  const isTildelt = useIsTildelt();
  const isTildeltSaksbehandler = useIsSaksbehandler();
  const isFeilregistrert = useIsFeilregistrert();
  const { data: oppgave } = useOppgave();

  if (isFeilregistrert) {
    return false;
  }

  if (isFullfoert || document.type === DocumentTypeEnum.UPLOADED) {
    // Anyone can archive documents that are uploaded.
    // Anyone can archive documents on completed cases.
    return true;
  }

  if (isTildelt) {
    // If the case is assigned, only the assigned caseworker can archive.
    return isTildeltSaksbehandler;
  }

  if (oppgave?.medunderskriver.flowState === FlowState.SENT) {
    return false;
  }

  return true;
};
