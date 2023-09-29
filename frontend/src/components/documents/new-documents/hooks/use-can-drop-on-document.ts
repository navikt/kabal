import { useContext } from 'react';
import { DragAndDropContext } from '@app/components/documents/drag-context';
import {
  canRolActOnDocument,
  getIsDocumentOwner,
  getIsInnsynsbegaering,
  isDroppableNewDocument,
} from '@app/components/documents/new-documents/hooks/helpers';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useIsFeilregistrert } from '@app/hooks/use-is-feilregistrert';
import { useIsFullfoert } from '@app/hooks/use-is-fullfoert';
import { useIsRol } from '@app/hooks/use-is-rol';
import { useIsSaksbehandler } from '@app/hooks/use-is-saksbehandler';
import { useUser } from '@app/simple-api-state/use-user';
import { DocumentTypeEnum, IMainDocument } from '@app/types/documents/documents';

export const useCanDropOnDocument = (targetDocument: IMainDocument) => {
  const { draggedDocument, draggedJournalfoertDocuments } = useContext(DragAndDropContext);
  const isRol = useIsRol();
  const isSaksbehandler = useIsSaksbehandler();
  const isFinished = useIsFullfoert();
  const isFeilregistrert = useIsFeilregistrert();
  const { data: oppgave } = useOppgave();
  const { data: user } = useUser();

  if (oppgave === undefined || targetDocument.isMarkertAvsluttet || isFeilregistrert) {
    return false;
  }

  if (getIsInnsynsbegaering(targetDocument)) {
    if (!getIsDocumentOwner(targetDocument, user?.navIdent)) {
      return false;
    }

    // Innsynsbegjæringer can only have archived documents as attachments.
    return draggedJournalfoertDocuments.length !== 0 || draggedDocument?.type === DocumentTypeEnum.JOURNALFOERT;
  }

  if (isFinished) {
    return false;
  }

  if (isSaksbehandler) {
    return draggedJournalfoertDocuments.length !== 0 || isDroppableNewDocument(draggedDocument, targetDocument.id);
  }

  if (isRol && canRolActOnDocument(targetDocument, oppgave)) {
    return draggedJournalfoertDocuments.length !== 0 || isDroppableNewDocument(draggedDocument, targetDocument.id);
  }

  return false;
};
