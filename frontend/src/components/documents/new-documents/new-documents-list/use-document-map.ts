import type { DocumentWithAttachments } from '@app/components/documents/new-documents/new-documents-list/types';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useGetDocumentsQuery } from '@app/redux-api/oppgaver/queries/documents';
import { DocumentTypeEnum, isParentDocument } from '@app/types/documents/documents';

export const useDocumentMap = () => {
  const oppgaveId = useOppgaveId();
  const { data, isSuccess } = useGetDocumentsQuery(oppgaveId);

  const documentMap: Map<string, DocumentWithAttachments> = new Map();

  if (!isSuccess) {
    return documentMap;
  }

  const { length } = data;

  for (let i = 0; i < length; i++) {
    const document = data[i];

    if (document === undefined) {
      continue;
    }

    if (isParentDocument(document)) {
      const existing = documentMap.get(document.id);

      if (existing === undefined) {
        documentMap.set(document.id, {
          mainDocument: document,
          pdfOrSmartDocuments: [],
          journalfoerteDocuments: [],
        });
      } else if (existing.mainDocument === undefined) {
        existing.mainDocument = document;
      }

      continue;
    }

    // New attachment.
    const existing = documentMap.get(document.parentId);
    const isJournalfoertDocument = document.type === DocumentTypeEnum.JOURNALFOERT;

    if (existing !== undefined) {
      // Known parent.
      if (isJournalfoertDocument) {
        existing.journalfoerteDocuments.push(document);
      } else {
        existing.pdfOrSmartDocuments.push(document);
      }
      continue;
    }

    // Unknown parent.
    documentMap.set(
      document.parentId,
      isJournalfoertDocument
        ? { pdfOrSmartDocuments: [], journalfoerteDocuments: [document] }
        : { pdfOrSmartDocuments: [document], journalfoerteDocuments: [] },
    );
  }

  return documentMap;
};
