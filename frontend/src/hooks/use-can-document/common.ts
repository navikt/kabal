import {
  CreatorRole,
  DocumentTypeEnum,
  type IMainDocument,
  type JournalfoertDokument,
} from '@app/types/documents/documents';
import { FlowState } from '@app/types/oppgave-common';

export const canRolEditDocument = (document: IMainDocument, flowState: FlowState | null) => {
  if (flowState !== FlowState.SENT) {
    return false;
  }

  if (document.type === DocumentTypeEnum.JOURNALFOERT && !hasAccessToArchivedDocument(document)) {
    return false;
  }

  return document.creator.creatorRole === CreatorRole.KABAL_ROL;
};

const hasAccessToArchivedDocument = (document: IMainDocument): document is JournalfoertDokument =>
  document.type === DocumentTypeEnum.JOURNALFOERT && document.journalfoertDokumentReference.hasAccess;
