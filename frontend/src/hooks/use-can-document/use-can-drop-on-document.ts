import { useContext } from 'react';
import { DragAndDropContext } from '@app/components/documents/drag-context';
import { getIsRolQuestions } from '@app/components/documents/new-documents/helpers';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useHasRole } from '@app/hooks/use-has-role';
import { useIsFeilregistrert } from '@app/hooks/use-is-feilregistrert';
import { useIsFullfoert } from '@app/hooks/use-is-fullfoert';
import { useIsRol } from '@app/hooks/use-is-rol';
import { useIsSaksbehandler } from '@app/hooks/use-is-saksbehandler';
import { Role } from '@app/types/bruker';
import { DistribusjonsType, DocumentTypeEnum, IMainDocument } from '@app/types/documents/documents';
import { IOppgavebehandling } from '@app/types/oppgavebehandling/oppgavebehandling';
import { isSentToRol } from './common';

export const useCanDropOnDocument = (targetDocument: IMainDocument) => {
  const { draggedDocument, draggedJournalfoertDocuments } = useContext(DragAndDropContext);
  const isRol = useIsRol();
  const isTildeltSaksbehandler = useIsSaksbehandler();
  const hasSaksbehandlerRole = useHasRole(Role.KABAL_SAKSBEHANDLING);
  const isFullfoert = useIsFullfoert();
  const isFeilregistrert = useIsFeilregistrert();
  const { data: oppgave } = useOppgave();

  if (targetDocument.isMarkertAvsluttet || isFeilregistrert || oppgave === undefined) {
    return false;
  }

  if (draggedJournalfoertDocuments.length !== 0) {
    if (targetDocument.dokumentTypeId === DistribusjonsType.KJENNELSE_FRA_TRYGDERETTEN) {
      return false;
    }

    if (isFullfoert) {
      return hasSaksbehandlerRole;
    }

    if (isTildeltSaksbehandler) {
      return true;
    }

    if (isRol) {
      return canRolActOnDocument(targetDocument, oppgave);
    }
  }

  const isAllowedNewDocument = isDroppableNewDocument(draggedDocument, targetDocument.id);

  if (!isAllowedNewDocument) {
    return false;
  }

  if (isTildeltSaksbehandler || (isFullfoert && hasSaksbehandlerRole)) {
    if (
      targetDocument.dokumentTypeId === DistribusjonsType.KJENNELSE_FRA_TRYGDERETTEN &&
      draggedDocument.type === DocumentTypeEnum.UPLOADED
    ) {
      return true;
    }

    return draggedDocument?.type === DocumentTypeEnum.JOURNALFOERT || getIsRolQuestions(targetDocument);
  }

  if (isRol) {
    return canRolActOnDocument(targetDocument, oppgave);
  }

  return false;
};

const isDroppableNewDocument = (dragged: IMainDocument | null, documentId: string): dragged is IMainDocument =>
  dragged !== null &&
  !dragged.isMarkertAvsluttet &&
  dragged.id !== documentId &&
  dragged.parentId !== documentId &&
  !getIsRolQuestions(dragged);

const canRolActOnDocument = (document: IMainDocument, oppgave: IOppgavebehandling) =>
  getIsRolQuestions(document) && isSentToRol(oppgave);
