import {
  CreatorRole,
  DocumentTypeEnum,
  IJournalfoertDokumentReference,
  IMainDocument,
} from '@app/types/documents/documents';
import { SaksTypeEnum } from '@app/types/kodeverk';
import { FlowState } from '@app/types/oppgave-common';
import { IOppgavebehandling } from '@app/types/oppgavebehandling/oppgavebehandling';

export const isSentToRol = (oppgave: IOppgavebehandling) =>
  (oppgave.typeId === SaksTypeEnum.KLAGE || oppgave.typeId === SaksTypeEnum.ANKE) &&
  oppgave.rol.flowState === FlowState.SENT;

export const canRolEditDocument = (document: IMainDocument, oppgave: IOppgavebehandling) => {
  if (!isSentToRol(oppgave)) {
    return false;
  }

  if (document.type === DocumentTypeEnum.JOURNALFOERT && !hasAccessToArchivedDocument(document)) {
    return false;
  }

  return document.creator.creatorRole === CreatorRole.KABAL_ROL;
};

const hasAccessToArchivedDocument = (document: IMainDocument): document is IJournalfoertDokumentReference =>
  document.type === DocumentTypeEnum.JOURNALFOERT && document.journalfoertDokumentReference.harTilgangTilArkivvariant;
