import { skipToken } from '@reduxjs/toolkit/dist/query';
import { useEffect } from 'react';
import { IShownDocument } from '@app/components/view-pdf/types';
import { getJournalfoertDocumentTabUrl, getNewDocumentTabUrl } from '@app/domain/tabbed-document-url';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useDocumentsPdfViewed } from '@app/hooks/settings/use-setting';
import { DocumentTypeEnum } from '@app/types/documents/documents';

const EMPTY_SHOWN_LIST: IShownDocument[] = [];

export const useMarkVisited = (url: string | undefined) => {
  const oppgaveId = useOppgaveId();
  const { value: showDocumentList = EMPTY_SHOWN_LIST } = useDocumentsPdfViewed();

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

    showDocumentList.forEach((document) => {
      const documentUrl =
        document.type === DocumentTypeEnum.JOURNALFOERT
          ? getJournalfoertDocumentTabUrl(document.journalpostId, document.dokumentInfoId)
          : getNewDocumentTabUrl(oppgaveId, document.documentId);

      window.history.replaceState(null, '', documentUrl);
    });

    window.history.replaceState(null, '', currentUrl);
  }, [oppgaveId, showDocumentList, url]);
};
