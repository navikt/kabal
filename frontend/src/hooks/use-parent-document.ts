import { useMemo } from 'react';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useGetDocumentsQuery } from '@app/redux-api/oppgaver/queries/documents';
import {
  DocumentTypeEnum,
  IFileDocument,
  IJournalfoertDokumentReference,
  IMainDocument,
  ISmartDocument,
} from '@app/types/documents/documents';

export const useParentDocument = (parentId: string | null): IMainDocument | undefined => {
  const oppgaveId = useOppgaveId();
  const { data = [] } = useGetDocumentsQuery(oppgaveId);

  return useMemo(() => (parentId === null ? undefined : data.find((doc) => doc.id === parentId)), [data, parentId]);
};

/** Returns the attachments under the given `parentId`. */
export const useAttachments = (parentId: string | null | undefined) => {
  const oppgaveId = useOppgaveId();
  const { data = [] } = useGetDocumentsQuery(oppgaveId);

  const pdfOrSmartDocuments: (IFileDocument | ISmartDocument)[] = [];
  const journalfoertDocumentReferences: IJournalfoertDokumentReference[] = [];

  if (parentId === null || parentId === undefined) {
    return { pdfOrSmartDocuments, journalfoertDocumentReferences };
  }

  for (const d of data) {
    if (d.parentId !== parentId) {
      continue;
    }

    if (d.type === DocumentTypeEnum.JOURNALFOERT) {
      journalfoertDocumentReferences.push(d);
    } else {
      pdfOrSmartDocuments.push(d);
    }
  }

  return { pdfOrSmartDocuments, journalfoertDocumentReferences };
};
