import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useGetDocumentsQuery } from '@app/redux-api/oppgaver/queries/documents';
import {
  DocumentTypeEnum,
  type IAttachmentDocument,
  type IFileDocument,
  type IParentDocument,
  type ISmartDocument,
  isAttachmentDocument,
  isParentDocument,
  type JournalfoertDokument,
} from '@app/types/documents/documents';
import { useCallback, useMemo } from 'react';

export const useLazyParentDocument = () => {
  const oppgaveId = useOppgaveId();
  const { data = [] } = useGetDocumentsQuery(oppgaveId);

  return (parentId: string | null): IParentDocument | undefined => {
    if (parentId === null) {
      return undefined;
    }

    for (const doc of data) {
      if (doc.id === parentId && isParentDocument(doc)) {
        return doc;
      }
    }
  };
};

export const useParentDocument = (parentId: string | null): IParentDocument | undefined => {
  const getParentDocument = useLazyParentDocument();

  return useMemo(() => getParentDocument(parentId), [getParentDocument, parentId]);
};

export const useLazyAttachments = () => {
  const oppgaveId = useOppgaveId();
  const { data = [] } = useGetDocumentsQuery(oppgaveId);

  return useCallback(
    (parentId: string | null): IAttachmentDocument[] => {
      const attachments: IAttachmentDocument[] = [];

      if (parentId === null) {
        return attachments;
      }

      for (const doc of data) {
        if (isAttachmentDocument(doc) && doc.parentId === parentId) {
          attachments.push(doc);
        }
      }

      return attachments;
    },
    [data],
  );
};

/** Returns the attachments under the given `parentId`. */
export const useAttachments = (parentId: string | null | undefined) => {
  const oppgaveId = useOppgaveId();
  const { data = [] } = useGetDocumentsQuery(oppgaveId);

  const pdfOrSmartDocuments: (IFileDocument<string> | ISmartDocument<string>)[] = [];
  const journalfoerteDocuments: JournalfoertDokument[] = [];

  if (parentId === null || parentId === undefined) {
    return { pdfOrSmartDocuments, journalfoerteDocuments };
  }

  for (const d of data) {
    if (d.parentId !== parentId) {
      continue;
    }

    if (d.type === DocumentTypeEnum.JOURNALFOERT) {
      journalfoerteDocuments.push(d);
    } else {
      pdfOrSmartDocuments.push(d);
    }
  }

  return { pdfOrSmartDocuments, journalfoerteDocuments };
};
