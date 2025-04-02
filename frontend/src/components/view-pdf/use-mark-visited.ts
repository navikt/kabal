import { getJournalfoertDocumentTabUrl, getNewDocumentTabUrl } from '@app/domain/tabbed-document-url';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useDocumentsPdfViewed } from '@app/hooks/settings/use-setting';
import { DocumentTypeEnum } from '@app/types/documents/documents';
import { skipToken } from '@reduxjs/toolkit/query';
import { useEffect } from 'react';

export const useMarkVisited = (url: string | undefined) => {
  const oppgaveId = useOppgaveId();
  const {
    value: { documents: showDocumentList },
  } = useDocumentsPdfViewed();

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
          : getNewDocumentTabUrl(oppgaveId, document.documentId);

      window.history.replaceState(null, '', documentUrl);
    }

    window.history.replaceState(null, '', currentUrl);
  }, [oppgaveId, showDocumentList, url]);
};
