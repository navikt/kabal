import { Tag } from '@navikt/ds-react';
import { useCallback } from 'react';
import { useGetDocument } from '@/components/documents/journalfoerte-documents/keyboard/hooks/get-document';
import { toast } from '@/components/toast/store';
import { type IArkivertDocument, Journalstatus } from '@/types/arkiverte-documents';

export const useSetAsAttachmentTo = (filteredDocuments: IArkivertDocument[], openModal: (open: boolean) => void) => {
  const getDocument = useGetDocument(filteredDocuments);

  return useCallback(() => {
    const focusedDocument = getDocument();

    if (focusedDocument === undefined || focusedDocument.journalstatus === Journalstatus.MOTTATT) {
      toast.error(
        <>
          Kan ikke bruke journalpost med status{' '}
          <Tag data-color="neutral" variant="outline" size="xsmall">
            mottatt
          </Tag>{' '}
          som vedlegg.
        </>,
      );
      return;
    }

    openModal(true);
  }, [getDocument, openModal]);
};
