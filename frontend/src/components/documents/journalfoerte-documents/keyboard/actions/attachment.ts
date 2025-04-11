import { useGetDocument } from '@app/components/documents/journalfoerte-documents/keyboard/hooks/get-document';
import { toast } from '@app/components/toast/store';
import { type IArkivertDocument, Journalstatus } from '@app/types/arkiverte-documents';
import { useCallback } from 'react';

export const useSetAsAttachmentTo = (filteredDocuments: IArkivertDocument[], openModal: (open: boolean) => void) => {
  const getDocument = useGetDocument(filteredDocuments);

  return useCallback(() => {
    const focusedDocument = getDocument();

    if (focusedDocument === undefined || focusedDocument.journalstatus === Journalstatus.MOTTATT) {
      toast.error('Kan ikke bruke journalpost med status "Mottatt" som vedlegg.');
      return;
    }

    openModal(true);
  }, [getDocument, openModal]);
};
