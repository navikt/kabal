import { DragAndDropContext } from '@app/components/documents/drag-context';
import { canDistributeAny } from '@app/components/documents/filetype';
import { getIsRolQuestions } from '@app/components/documents/new-documents/helpers';
import { getIsIncomingDocument } from '@app/functions/is-incoming-document';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useHasRole } from '@app/hooks/use-has-role';
import { useIsFeilregistrert } from '@app/hooks/use-is-feilregistrert';
import { useIsFullfoert } from '@app/hooks/use-is-fullfoert';
import { useIsRol } from '@app/hooks/use-is-rol';
import { useIsSaksbehandler } from '@app/hooks/use-is-saksbehandler';
import { Role } from '@app/types/bruker';
import { DistribusjonsType, DocumentTypeEnum, type IMainDocument } from '@app/types/documents/documents';
import { FlowState } from '@app/types/oppgave-common';
import type { IOppgavebehandling } from '@app/types/oppgavebehandling/oppgavebehandling';
import { useContext } from 'react';

export const useCanDropOnDocument = (targetDocument: IMainDocument) => {
  const { draggedDocument, draggedJournalfoertDocuments } = useContext(DragAndDropContext);
  const isRol = useIsRol();
  const isTildeltSaksbehandler = useIsSaksbehandler();
  const hasSaksbehandlerRole = useHasRole(Role.KABAL_SAKSBEHANDLING);
  const hasOppgavestyringRole = useHasRole(Role.KABAL_OPPGAVESTYRING_ALLE_ENHETER);
  const isFullfoert = useIsFullfoert();
  const isFeilregistrert = useIsFeilregistrert();
  const { data: oppgave } = useOppgave();

  if (targetDocument.isMarkertAvsluttet || isFeilregistrert || oppgave === undefined) {
    return false;
  }

  if (draggedJournalfoertDocuments.length > 0) {
    if (getIsIncomingDocument(targetDocument.dokumentTypeId)) {
      return false;
    }

    // File types that cannot be distributed, can only be dropped on documents of type NOTAT.
    if (
      draggedJournalfoertDocuments.some((d) => !canDistributeAny(d.varianter)) &&
      targetDocument.dokumentTypeId !== DistribusjonsType.NOTAT
    ) {
      return false;
    }

    if (isFullfoert) {
      return hasSaksbehandlerRole;
    }

    if (isTildeltSaksbehandler || hasOppgavestyringRole) {
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

  if (isTildeltSaksbehandler || hasOppgavestyringRole || (isFullfoert && hasSaksbehandlerRole)) {
    if (getIsIncomingDocument(targetDocument.dokumentTypeId)) {
      return draggedDocument.type === DocumentTypeEnum.UPLOADED;
    }

    return draggedDocument.type === DocumentTypeEnum.JOURNALFOERT || getIsRolQuestions(targetDocument);
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
  getIsRolQuestions(document) && oppgave.rol.flowState === FlowState.SENT;
