import type { IShownDocument } from '@/components/file-viewer/types';
import { getIsIncomingDocument } from '@/functions/is-incoming-document';
import { DocumentTypeEnum, type IDocument, type JournalfoertDokument } from '@/types/documents/documents';

export const expandDua = (doc: IShownDocument, documentsInProgress: IDocument[]): IShownDocument[] => {
  if (doc.type !== DocumentTypeEnum.SMART && doc.type !== DocumentTypeEnum.UPLOADED) {
    return [doc];
  }

  if (doc.parentId !== null) {
    return [doc];
  }

  const attachments = documentsInProgress.filter((d) => d.parentId === doc.documentId);

  if (attachments.length === 0) {
    return [doc];
  }

  const attachmentDocs: IShownDocument[] = attachments.map(attachmentToShownDocument);

  const dua = documentsInProgress.find(({ id }) => doc.documentId === id);

  if (dua === undefined || getIsIncomingDocument(dua.dokumentTypeId)) {
    return [doc, ...attachmentDocs];
  }

  const vedleggsoversikt: IShownDocument = {
    type: DocumentTypeEnum.VEDLEGGSOVERSIKT,
    documentId: doc.documentId,
    parentId: null,
  };

  return [doc, vedleggsoversikt, ...attachmentDocs];
};

const attachmentToShownDocument = (doc: IDocument): IShownDocument => {
  if (isJournalfoertDocument(doc)) {
    return {
      type: DocumentTypeEnum.JOURNALFOERT,
      journalpostId: doc.journalfoertDokumentReference.journalpostId,
      dokumentInfoId: doc.journalfoertDokumentReference.dokumentInfoId,
      varianter: doc.journalfoertDokumentReference.varianter,
    };
  }

  return {
    type: doc.type,
    documentId: doc.id,
    parentId: doc.parentId,
  };
};

const isJournalfoertDocument = (doc: IDocument): doc is JournalfoertDokument =>
  doc.type === DocumentTypeEnum.JOURNALFOERT;
