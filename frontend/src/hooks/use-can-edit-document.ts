import { skipToken } from '@reduxjs/toolkit/dist/query';
import { useContext } from 'react';
import { DragAndDropContext } from '@app/components/documents/drag-context';
import { isRolNotat } from '@app/components/documents/new-documents/helpers';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useIsFeilregistrert } from '@app/hooks/use-is-feilregistrert';
import { useIsFullfoert } from '@app/hooks/use-is-fullfoert';
import { useIsRol } from '@app/hooks/use-is-rol';
import { useIsSaksbehandler } from '@app/hooks/use-is-saksbehandler';
import { useGetDocumentsQuery } from '@app/redux-api/oppgaver/queries/documents';
import { DocumentTypeEnum, IJournalfoertDokumentReference, IMainDocument } from '@app/types/documents/documents';
import { SaksTypeEnum } from '@app/types/kodeverk';
import { FlowState } from '@app/types/oppgave-common';
import { IOppgavebehandling } from '@app/types/oppgavebehandling/oppgavebehandling';

export const useCanDropOnDocument = (targetDocument: IMainDocument) => {
  const { draggedDocument, draggedJournalfoertDocuments } = useContext(DragAndDropContext);
  const isRol = useIsRol();
  const isSaksbehandler = useIsSaksbehandler();
  const isOppgaveOpen = useIsOppgaveOpen();
  const { data: oppgave } = useOppgave();

  if (targetDocument.isMarkertAvsluttet || isOppgaveOpen || oppgave === undefined) {
    return false;
  }

  if (draggedJournalfoertDocuments.length !== 0) {
    if (isSaksbehandler) {
      return true;
    }

    if (isRol) {
      return canRolActOnDocument(targetDocument, oppgave);
    }
  }

  const isAllowedNewDocument = isDroppableNewDocument(draggedDocument, targetDocument.id);

  if (isSaksbehandler) {
    return isAllowedNewDocument;
  }

  if (isRol) {
    return isAllowedNewDocument && canRolActOnDocument(targetDocument, oppgave) && isSentToRol(oppgave);
  }

  return false;
};

export const useCanDeleteDocument = (document: IMainDocument | null) => {
  const isRol = useIsRol();
  const isSaksbehandler = useIsSaksbehandler();
  const isOppgaveOpen = useIsOppgaveOpen();
  const oppgaveId = useOppgaveId();
  const { data: allDocuments = [] } = useGetDocumentsQuery(isRol ? oppgaveId : skipToken);
  const { data: oppgave } = useOppgave();

  if (document === null || document.isMarkertAvsluttet || isOppgaveOpen) {
    return false;
  }

  if (isSaksbehandler) {
    return true;
  }

  if (oppgave === undefined) {
    return false;
  }

  if (isRol && document.parentId !== null && hasAccessToArchivedDocument(document) && isSentToRol(oppgave)) {
    const parentDocument = allDocuments.find(({ id }) => id === document.parentId);

    return parentDocument !== undefined && isRolNotat(parentDocument);
  }

  return false;
};

export const useCanEditDocument = (document: IMainDocument, parentDocument?: IMainDocument) => {
  const isRol = useIsRol();
  const isSaksbehandler = useIsSaksbehandler();
  const isOppgaveOpen = useIsOppgaveOpen();
  const { data: oppgave } = useOppgave();

  if (document.isMarkertAvsluttet || isOppgaveOpen || oppgave === undefined) {
    return false;
  }

  const isJournalfoert = document.type === DocumentTypeEnum.JOURNALFOERT;

  if (isJournalfoert && !document.journalfoertDokumentReference.harTilgangTilArkivvariant) {
    return false;
  }

  if (isSaksbehandler) {
    return true;
  }

  return (
    isRol &&
    parentDocument !== undefined &&
    isRolNotat(parentDocument) &&
    (isJournalfoert || isRolNotat(document)) &&
    isSentToRol(oppgave)
  );
};

const isSentToRol = (oppgave: IOppgavebehandling) =>
  (oppgave.typeId === SaksTypeEnum.KLAGE || oppgave.typeId === SaksTypeEnum.ANKE) &&
  oppgave.rol.flowState === FlowState.SENT;

const useIsOppgaveOpen = () => {
  const isFinished = useIsFullfoert();
  const isFeilregistrert = useIsFeilregistrert();

  return isFinished && isFeilregistrert;
};

const hasAccessToArchivedDocument = (document: IMainDocument): document is IJournalfoertDokumentReference =>
  document.type === DocumentTypeEnum.JOURNALFOERT && document.journalfoertDokumentReference.harTilgangTilArkivvariant;

const isDroppableNewDocument = (dragged: IMainDocument | null, documentId: string): dragged is IMainDocument =>
  dragged !== null && !dragged.isMarkertAvsluttet && dragged.id !== documentId && dragged.parentId !== documentId;

const canRolActOnDocument = (document: IMainDocument, oppgave: IOppgavebehandling) =>
  isRolNotat(document) && isSentToRol(oppgave);
