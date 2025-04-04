import { getJournalfoertDocumentTabUrl, getNewDocumentTabUrl } from '@app/domain/tabbed-document-url';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useShownDocuments } from '@app/hooks/use-shown-documents';
import { DocumentTypeEnum } from '@app/types/documents/documents';
import { skipToken } from '@reduxjs/toolkit/query';
import { useEffect } from 'react';

export const useMarkVisited = (url: string | undefined) => {
  const oppgaveId = useOppgaveId();
  const { showDocumentList } = useShownDocuments();

  useEffect(() => {
    if (url === undefined) {
      return;
    }

    const currentUrl = window.location.href;
    window.history.replaceState(null, '', url);

    if (showDocumentList.length <= 1 || oppgaveId === skipToken) {
      window.history.replaceState(null, '', currentUrl);

      return;
    }

    for (const document of showDocumentList) {
      const documentUrl =
        document.type === DocumentTypeEnum.JOURNALFOERT
          ? getJournalfoertDocumentTabUrl(document.journalpostId, document.dokumentInfoId)
          : getNewDocumentTabUrl(oppgaveId, document.documentId, document.parentId);

      window.history.replaceState(null, '', documentUrl);
    }

    window.history.replaceState(null, '', currentUrl);
  }, [oppgaveId, showDocumentList, url]);
};
