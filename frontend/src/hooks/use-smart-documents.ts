import { useGetDocumentsQuery } from '../redux-api/documents';
import { IMainDocument, ISmartDocument } from '../types/documents';

export const useSmartDocuments = (oppgaveId: string): ISmartDocument[] | undefined => {
  const { data, isLoading } = useGetDocumentsQuery({ oppgaveId });

  if (isLoading || typeof data === 'undefined') {
    return undefined;
  }

  return data.filter(isSmartDocument);
};

const isSmartDocument = (document: IMainDocument): document is ISmartDocument => document.isSmartDokument;
