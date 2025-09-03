import { useGetDocumentsQuery } from '@app/redux-api/oppgaver/queries/documents';
import type { ISmartDocumentOrAttachment } from '@app/types/documents/documents';
import type { skipToken } from '@reduxjs/toolkit/query';

export const useSmartDocuments = (oppgaveId: string | typeof skipToken): ISmartDocumentOrAttachment[] | undefined => {
  const { data } = useGetDocumentsQuery(oppgaveId);

  return data?.filter((d) => d.isSmartDokument).toSorted((a, b) => a.created.localeCompare(b.created));
};
