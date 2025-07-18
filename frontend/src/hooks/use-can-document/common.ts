import {
  CreatorRole,
  DocumentTypeEnum,
  type IDocument,
  type JournalfoertDokument,
} from '@app/types/documents/documents';
import { FlowState } from '@app/types/oppgave-common';

export const canRolEditDocument = (document: IDocument, flowState: FlowState | null) => {
  if (flowState !== FlowState.SENT) {
    return false;
  }

  if (document.type === DocumentTypeEnum.JOURNALFOERT && !hasAccessToArchivedDocument(document)) {
    return false;
  }

  return document.creator.creatorRole === CreatorRole.KABAL_ROL;
};

const hasAccessToArchivedDocument = (document: IDocument): document is JournalfoertDokument =>
  document.type === DocumentTypeEnum.JOURNALFOERT && document.journalfoertDokumentReference.hasAccess;
