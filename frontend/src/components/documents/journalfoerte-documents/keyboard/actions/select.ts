import { useDown } from '@app/components/documents/journalfoerte-documents/keyboard/actions/down';
import { home, useEnd } from '@app/components/documents/journalfoerte-documents/keyboard/actions/home-end';
import { useUp } from '@app/components/documents/journalfoerte-documents/keyboard/actions/up';
import { getDocumentPath } from '@app/components/documents/journalfoerte-documents/keyboard/helpers/index-converters';
import {
  useGetDocument,
  useGetVedlegg,
} from '@app/components/documents/journalfoerte-documents/keyboard/hooks/get-document';
import { getIsInVedleggList } from '@app/components/documents/journalfoerte-documents/keyboard/state/focus';
import { SelectContext } from '@app/components/documents/journalfoerte-documents/select-context/select-context';
import type { IArkivertDocument } from '@app/types/arkiverte-documents';
import type { IJournalfoertDokumentId } from '@app/types/oppgave-common';
import { useCallback, useContext } from 'react';

export const useToggleSelectAll = (allSelectableDocuments: IJournalfoertDokumentId[]) => {
  const { selectMany, unselectAll, selectedCount } = useContext(SelectContext);

  return useCallback(
    () => (selectedCount > 0 ? unselectAll() : selectMany(allSelectableDocuments)),
    [allSelectableDocuments, selectedCount, selectMany, unselectAll],
  );
};

export const useToggleSelect = (documents: IArkivertDocument[]) => {
  const { selectOne, unselectOne, isSelected } = useContext(SelectContext);
  const getDocument = useGetDocument(documents);
  const getVedlegg = useGetVedlegg();

  return useCallback(() => {
    const focusedDocument = getDocument();

    const hasDocument = focusedDocument !== undefined;

    if (!hasDocument) {
      return;
    }

    const focusedVedlegg = getVedlegg(focusedDocument);

    if (!focusedDocument.hasAccess) {
      return;
    }

    if (!getIsInVedleggList()) {
      isSelected(focusedDocument) ? unselectOne(focusedDocument) : selectOne(focusedDocument);
    }

    if (focusedVedlegg === undefined) {
      return;
    }

    const id: IJournalfoertDokumentId = {
      journalpostId: focusedDocument.journalpostId,
      dokumentInfoId: focusedVedlegg.dokumentInfoId,
    };

    isSelected(id) ? unselectOne(id) : selectOne(id);
  }, [isSelected, selectOne, unselectOne, getDocument, getVedlegg]);
};

export const useSelectDown = (documents: IArkivertDocument[]) => {
  const { selectRange } = useContext(SelectContext);
  const down = useDown(documents);

  return useCallback(() => {
    const beforePath = getDocumentPath();
    const afterPath = down();
    selectRange(beforePath, afterPath);
  }, [down, selectRange]);
};

export const useSelectUp = (documents: IArkivertDocument[]) => {
  const { selectRange } = useContext(SelectContext);
  const up = useUp(documents);

  return useCallback(() => {
    const beforePath = getDocumentPath();
    const afterPath = up();
    selectRange(beforePath, afterPath);
  }, [selectRange, up]);
};

export const useSelectHome = () => {
  const { selectRange } = useContext(SelectContext);

  return useCallback(() => {
    const beforePath = getDocumentPath();
    const afterPath = home();
    selectRange(beforePath, afterPath);
  }, [selectRange]);
};

export const useSelectEnd = (documents: IArkivertDocument[]) => {
  const { selectRange } = useContext(SelectContext);
  const end = useEnd(documents);

  return useCallback(() => {
    const beforePath = getDocumentPath();
    const afterPath = end();
    selectRange(beforePath, afterPath);
  }, [end, selectRange]);
};
