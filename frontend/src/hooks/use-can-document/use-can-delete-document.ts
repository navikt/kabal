import { useMemo } from 'react';
import { getIsIncomingDocument } from '@app/functions/is-incoming-document';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { canRolEditDocument } from '@app/hooks/use-can-document/common';
import { useHasRole } from '@app/hooks/use-has-role';
import { useIsFeilregistrert } from '@app/hooks/use-is-feilregistrert';
import { useIsFullfoert } from '@app/hooks/use-is-fullfoert';
import { useIsRol } from '@app/hooks/use-is-rol';
import { useIsSaksbehandler } from '@app/hooks/use-is-saksbehandler';
import { Role } from '@app/types/bruker';
import { CreatorRole, IMainDocument } from '@app/types/documents/documents';

export const useCanDeleteDocument = (
  document: IMainDocument | null,
  containsRolAttachments: boolean,
  parentDocument?: IMainDocument,
) => {
  const isRol = useIsRol();
  const isTildeltSaksbehandler = useIsSaksbehandler();
  const hasSaksbehandlerRole = useHasRole(Role.KABAL_SAKSBEHANDLING);
  const isFullfoert = useIsFullfoert();
  const isFeilregistrert = useIsFeilregistrert();
  const parentIsMarkertAvsluttet = parentDocument?.isMarkertAvsluttet === true;
  const { data: oppgave } = useOppgave();

  return useMemo(() => {
    if (document === null || document.isMarkertAvsluttet || parentIsMarkertAvsluttet || isFeilregistrert) {
      return false;
    }

    if (isFullfoert) {
      return hasSaksbehandlerRole;
    }

    if (getIsIncomingDocument(document)) {
      return true;
    }

    if (isTildeltSaksbehandler) {
      if (document.creator.creatorRole !== CreatorRole.KABAL_SAKSBEHANDLING) {
        return false;
      }

      return !containsRolAttachments;
    }

    if (oppgave === undefined) {
      return false;
    }

    if (isRol) {
      return canRolEditDocument(document, oppgave);
    }

    return false;
  }, [
    containsRolAttachments,
    document,
    hasSaksbehandlerRole,
    isFeilregistrert,
    isFullfoert,
    isRol,
    isTildeltSaksbehandler,
    oppgave,
    parentIsMarkertAvsluttet,
  ]);
};
