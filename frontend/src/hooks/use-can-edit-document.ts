import { useContext, useMemo } from 'react';
import { DragAndDropContext } from '@app/components/documents/drag-context';
import { getIsRolQuestions } from '@app/components/documents/new-documents/helpers';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useHasRole } from '@app/hooks/use-has-role';
import { useIsFeilregistrert } from '@app/hooks/use-is-feilregistrert';
import { useIsFullfoert } from '@app/hooks/use-is-fullfoert';
import { useIsRol } from '@app/hooks/use-is-rol';
import { useIsSaksbehandler } from '@app/hooks/use-is-saksbehandler';
import { Role } from '@app/types/bruker';
import { DocumentTypeEnum, IJournalfoertDokumentReference, IMainDocument } from '@app/types/documents/documents';
import { SaksTypeEnum } from '@app/types/kodeverk';
import { FlowState } from '@app/types/oppgave-common';
import { IOppgavebehandling } from '@app/types/oppgavebehandling/oppgavebehandling';

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

  if (isTildeltSaksbehandler || (isFullfoert && hasSaksbehandlerRole)) {
    return (
      isAllowedNewDocument &&
      (draggedDocument?.type === DocumentTypeEnum.JOURNALFOERT || getIsRolQuestions(targetDocument))
    );
  }

  if (isRol) {
    return isAllowedNewDocument && canRolActOnDocument(targetDocument, oppgave);
  }

  return false;
};

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

    if (isTildeltSaksbehandler) {
      if (document.creatorRole !== Role.KABAL_SAKSBEHANDLING) {
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

// eslint-disable-next-line import/no-unused-modules
export const getCanDeleteDocument = (
  document: IMainDocument,
  parentDocument: IMainDocument,
  isSaksbehandler: boolean,
  isRol: boolean,
  isFeilregistrert: boolean,
  containsRolAttachments: boolean,
  oppgave: IOppgavebehandling,
) => {
  if (document.isMarkertAvsluttet || parentDocument.isMarkertAvsluttet || isFeilregistrert) {
    return false;
  }

  if (isSaksbehandler) {
    if (document.creatorRole !== Role.KABAL_SAKSBEHANDLING) {
      return false;
    }

    return !containsRolAttachments;
  }

  if (isRol) {
    return canRolEditDocument(document, oppgave);
  }

  return false;
};

export const useCanEditDocument = (document: IMainDocument, parentDocument?: IMainDocument) => {
  const isRol = useIsRol();
  const isTildeltSaksbehandler = useIsSaksbehandler();
  const hasSaksbehandlerRole = useHasRole(Role.KABAL_SAKSBEHANDLING);
  const isFeilregistrert = useIsFeilregistrert();
  const isFullfoert = useIsFullfoert();
  const { data: oppgave } = useOppgave();

  const parentIsMarkertAvsluttet = parentDocument?.isMarkertAvsluttet === true;

  if (parentIsMarkertAvsluttet || document.isMarkertAvsluttet || isFeilregistrert || oppgave === undefined) {
    return false;
  }

  const isJournalfoert = document.type === DocumentTypeEnum.JOURNALFOERT;

  if (isJournalfoert && !document.journalfoertDokumentReference.harTilgangTilArkivvariant) {
    return false;
  }

  if (isFullfoert) {
    return hasSaksbehandlerRole;
  }

  if (isTildeltSaksbehandler) {
    return document.creatorRole === Role.KABAL_SAKSBEHANDLING;
  }

  return isRol && canRolEditDocument(document, oppgave);
};

const isSentToRol = (oppgave: IOppgavebehandling) =>
  (oppgave.typeId === SaksTypeEnum.KLAGE || oppgave.typeId === SaksTypeEnum.ANKE) &&
  oppgave.rol.flowState === FlowState.SENT;

const hasAccessToArchivedDocument = (document: IMainDocument): document is IJournalfoertDokumentReference =>
  document.type === DocumentTypeEnum.JOURNALFOERT && document.journalfoertDokumentReference.harTilgangTilArkivvariant;

const isDroppableNewDocument = (dragged: IMainDocument | null, documentId: string): dragged is IMainDocument =>
  dragged !== null &&
  !dragged.isMarkertAvsluttet &&
  dragged.id !== documentId &&
  dragged.parentId !== documentId &&
  !getIsRolQuestions(dragged);

const canRolActOnDocument = (document: IMainDocument, oppgave: IOppgavebehandling) =>
  getIsRolQuestions(document) && isSentToRol(oppgave);

const canRolEditDocument = (document: IMainDocument, oppgave: IOppgavebehandling) => {
  if (!isSentToRol(oppgave)) {
    return false;
  }

  if (document.type === DocumentTypeEnum.JOURNALFOERT && !hasAccessToArchivedDocument(document)) {
    return false;
  }

  return document.creatorRole === Role.KABAL_ROL;
};
