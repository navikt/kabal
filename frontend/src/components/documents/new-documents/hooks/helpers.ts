import { getIsRolQuestions } from '@app/components/documents/new-documents/helpers';
import { Role } from '@app/types/bruker';
import {
  DocumentTypeEnum,
  IJournalfoertDokumentReference,
  IMainDocument,
  ISmartDocument,
} from '@app/types/documents/documents';
import { SaksTypeEnum } from '@app/types/kodeverk';
import { FlowState } from '@app/types/oppgave-common';
import { IOppgavebehandling } from '@app/types/oppgavebehandling/oppgavebehandling';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';

export const getIsInnsynsbegaering = (document: IMainDocument): document is ISmartDocument =>
  document.isSmartDokument && document.templateId === TemplateIdEnum.SVAR_PAA_INNSYNSBEGJAERING;

export const getIsDocumentOwner = (document: IMainDocument, navIdent: string | undefined): boolean =>
  navIdent === document.creatorIdent;

export const isDroppableNewDocument = (dragged: IMainDocument | null, documentId: string): dragged is IMainDocument =>
  dragged !== null &&
  !dragged.isMarkertAvsluttet &&
  dragged.id !== documentId &&
  dragged.parentId !== documentId &&
  !getIsRolQuestions(dragged) &&
  !getIsInnsynsbegaering(dragged);

export const canRolActOnDocument = (document: IMainDocument, oppgave: IOppgavebehandling) =>
  getIsRolQuestions(document) && isSentToRol(oppgave);

export const canRolEditDocument = (document: IMainDocument, oppgave: IOppgavebehandling) => {
  if (!isSentToRol(oppgave)) {
    return false;
  }

  if (document.type === DocumentTypeEnum.JOURNALFOERT && !hasAccessToArchivedDocument(document)) {
    return false;
  }

  return document.creatorRole === Role.KABAL_ROL;
};

const isSentToRol = (oppgave: IOppgavebehandling) =>
  (oppgave.typeId === SaksTypeEnum.KLAGE || oppgave.typeId === SaksTypeEnum.ANKE) &&
  oppgave.rol.flowState === FlowState.SENT;

const hasAccessToArchivedDocument = (document: IMainDocument): document is IJournalfoertDokumentReference =>
  document.type === DocumentTypeEnum.JOURNALFOERT && document.journalfoertDokumentReference.harTilgangTilArkivvariant;
