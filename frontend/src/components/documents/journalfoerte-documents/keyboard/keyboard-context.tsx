import { getSelectedDocumentsInOrder } from '@app/components/documents/journalfoerte-documents/heading/selected-in-order';
import { AttachmentModal } from '@app/components/documents/journalfoerte-documents/keyboard/attachment-modal';
import {
  decrement,
  getLastIndex,
  increment,
} from '@app/components/documents/journalfoerte-documents/keyboard/increment-decrement';
import { RenameModal } from '@app/components/documents/journalfoerte-documents/keyboard/rename-modal';
import { getId } from '@app/components/documents/journalfoerte-documents/select-context/helpers';
import { SelectContext } from '@app/components/documents/journalfoerte-documents/select-context/select-context';
import type { DocumentPath } from '@app/components/documents/journalfoerte-documents/select-context/types';
import { TabContext } from '@app/components/documents/tab-context';
import { TAB_MANAGER } from '@app/components/documents/use-is-tab-open';
import { toast } from '@app/components/toast/store';
import {
  getJournalfoertDocumentTabId,
  getJournalfoertDocumentTabUrl,
  getMergedDocumentTabId,
  getMergedDocumentTabUrl,
} from '@app/domain/tabbed-document-url';
import { clamp } from '@app/functions/clamp';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useDocumentsOnlyIncluded, useDocumentsPdfViewed } from '@app/hooks/settings/use-setting';
import {
  useRemoveAllTilknyttedeDocumentsMutation,
  useRemoveTilknyttetDocumentMutation,
} from '@app/redux-api/oppgaver/mutations/remove-tilknytt-document';
import { useTilknyttDocumentMutation } from '@app/redux-api/oppgaver/mutations/tilknytt-document';
import { useLazyMergedDocumentsReferenceQuery } from '@app/redux-api/oppgaver/queries/documents';
import { type IArkivertDocument, Journalstatus } from '@app/types/arkiverte-documents';
import { DocumentTypeEnum } from '@app/types/documents/documents';
import type { IJournalfoertDokumentId } from '@app/types/oppgave-common';
import { skipToken } from '@reduxjs/toolkit/query';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

const NOOP = () => {};

interface KeyboardContextType {
  // Navigation
  up: (amount?: number) => void;
  down: (amount?: number) => void;
  home: () => void;
  end: () => void;
  reset: () => void;

  // Actions
  selectDown: (amount?: number) => void;
  selectUp: (amount?: number) => void;
  collapseVedlegg: () => void;
  expandVedlegg: () => void;
  collapseAllVedlegg: () => void;
  expandAllVedlegg: () => void;
  toggleInfo: () => void;
  toggleInclude: () => void;
  toggleShowIncludeOnly: () => void;
  toggleSelect: () => void;
  toggleSelectAll: () => void;
  setAsAttachmentTo: () => void;
  rename: () => void;
  openInline: () => void;
  openNewTab: () => void;

  // State
  focusedDocumentIndex: number;
  focusedVedleggIndex: number;
}

export const KeyboardContext = createContext<KeyboardContextType>({
  // Navigation
  up: NOOP,
  down: NOOP,
  home: NOOP,
  end: NOOP,
  reset: NOOP,

  // Actions
  selectDown: NOOP,
  selectUp: NOOP,
  collapseVedlegg: NOOP,
  expandVedlegg: NOOP,
  collapseAllVedlegg: NOOP,
  expandAllVedlegg: NOOP,
  toggleInfo: NOOP,
  toggleInclude: NOOP,
  toggleShowIncludeOnly: NOOP,
  toggleSelect: NOOP,
  toggleSelectAll: NOOP,
  setAsAttachmentTo: NOOP,
  rename: NOOP,
  openInline: NOOP,
  openNewTab: NOOP,

  // State
  focusedDocumentIndex: -1,
  focusedVedleggIndex: -1,
});

export const useKeyboardContext = () => {
  const context = useContext(KeyboardContext);

  if (!context) {
    throw new Error('useKeyboardContext must be used within a KeyboardProvider');
  }

  return context;
};

interface KeyboardContextElementProps {
  children: React.ReactNode;
  documents: IArkivertDocument[];
  allSelectableDocuments: IJournalfoertDokumentId[];
  showVedleggIdList: string[];
  setShowVedleggIdList: (ids: string[] | ((ids: string[]) => string[])) => void;
  setShowMetadataIdList: (ids: string[] | ((ids: string[]) => string[])) => void;
  scrollToTop: () => void;
}

export const KeyboardContextElement = ({
  children,
  documents,
  allSelectableDocuments,
  showVedleggIdList,
  setShowVedleggIdList,
  setShowMetadataIdList,
  scrollToTop,
}: KeyboardContextElementProps) => {
  const oppgaveId = useOppgaveId();
  const attachmentModalRef = useRef<HTMLDialogElement>(null);
  const renameModalRef = useRef<HTMLDialogElement>(null);
  const { setValue: setShowOnlyIncludedDocuments } = useDocumentsOnlyIncluded();
  const {
    selectOne,
    unselectOne,
    selectMany,
    selectRange,
    unselectAll,
    isSelected,
    selectedDocuments,
    selectedCount,
    getSelectedDocuments,
  } = useContext(SelectContext);
  const [tilknyttDocument] = useTilknyttDocumentMutation();
  const [removeIncludedDocument] = useRemoveTilknyttetDocumentMutation();
  const [removeAllIncludedDocuments] = useRemoveAllTilknyttedeDocumentsMutation();
  const [getMergedDocumentRef] = useLazyMergedDocumentsReferenceQuery();
  const { value: shownDocuments, setValue: setShownDocuments } = useDocumentsPdfViewed();
  const [virtualDocumentIndex, setVirtualDocumentIndex] = useState<number>(-1);
  const [focusedVedleggIndex, setFocusedVedleggIndex] = useState<number>(-1);

  const isInVedleggList = focusedVedleggIndex !== -1;
  const validDocumentIndexes = useValidDocumentIndexes(documents);
  const firstVirtualDocumentIndex = validDocumentIndexes.length > 0 ? 0 : -1;
  const lastVirtualDocumentIndex = getLastIndex(validDocumentIndexes);
  const toRealDocumentIndex = useCallback((i: number): number => validDocumentIndexes[i] ?? -1, [validDocumentIndexes]);
  const getDocument = useCallback(
    (vIndex: number) => documents[toRealDocumentIndex(vIndex)],
    [documents, toRealDocumentIndex],
  );
  const focusedDocument = getDocument(virtualDocumentIndex);
  const hasDocument = focusedDocument !== undefined;
  const focusedVedlegg = hasDocument ? focusedDocument.vedlegg[focusedVedleggIndex] : undefined;
  const isOnDocument = hasDocument && !isInVedleggList;
  const lastVedleggIndex = getLastIndex(focusedDocument?.vedlegg);

  const virtualDocumentIndexRef = useRef(virtualDocumentIndex);

  useEffect(() => {
    virtualDocumentIndexRef.current = virtualDocumentIndex;
  }, [virtualDocumentIndex]);

  const focusedVedleggIndexRef = useRef(focusedVedleggIndex);

  useEffect(() => {
    focusedVedleggIndexRef.current = focusedVedleggIndex;
  }, [focusedVedleggIndex]);

  useEffect(() => {
    if (virtualDocumentIndexRef.current === -1) {
      return;
    }

    const clampedVirtualDocumentIndex = clamp(
      virtualDocumentIndexRef.current,
      firstVirtualDocumentIndex,
      lastVirtualDocumentIndex,
    );
    setVirtualDocumentIndex(clampedVirtualDocumentIndex);

    const document = getDocument(clampedVirtualDocumentIndex);
    const firstVedleggIndex = document !== undefined && document.vedlegg.length > 0 ? 0 : -1;
    const lastVedleggIndex = getLastIndex(document?.vedlegg);
    setFocusedVedleggIndex(clamp(focusedVedleggIndexRef.current, firstVedleggIndex, lastVedleggIndex));
  }, [firstVirtualDocumentIndex, lastVirtualDocumentIndex, getDocument]);

  const getHasVisibleVedlegg = ({ vedlegg, journalpostId }: IArkivertDocument) =>
    vedlegg.length > 0 && showVedleggIdList.includes(journalpostId);

  const toDocumentPath = (d = virtualDocumentIndex, v = focusedVedleggIndex): DocumentPath => [
    toRealDocumentIndex(d),
    v,
  ];

  const down = (amount = 1): DocumentPath => {
    if (virtualDocumentIndex === -1) {
      setVirtualDocumentIndex(firstVirtualDocumentIndex);
      return toDocumentPath(firstVirtualDocumentIndex);
    }

    if (!hasDocument) {
      return toDocumentPath();
    }

    if (focusedVedleggIndex !== lastVedleggIndex && getHasVisibleVedlegg(focusedDocument)) {
      const newFocusedVedleggIndex = Math.min(focusedVedleggIndex + amount, lastVedleggIndex);
      setFocusedVedleggIndex(newFocusedVedleggIndex);
      return toDocumentPath(virtualDocumentIndex, newFocusedVedleggIndex);
    }

    setFocusedVedleggIndex(-1);
    const newVirtualDocumentIndex = increment(virtualDocumentIndex, amount, lastVirtualDocumentIndex);
    setVirtualDocumentIndex(newVirtualDocumentIndex);
    return toDocumentPath(newVirtualDocumentIndex, -1);
  };

  const up = (amount = 1): DocumentPath => {
    if (isInVedleggList) {
      const newFocusedVedleggIndex = focusedVedleggIndex === 0 ? -1 : Math.max(focusedVedleggIndex - amount, 0);
      setFocusedVedleggIndex(newFocusedVedleggIndex);
      return toDocumentPath(virtualDocumentIndex, newFocusedVedleggIndex);
    }

    const nextVirtualDocumentIndex = decrement(virtualDocumentIndex, 1, -1, amount);
    const nextDocument = getDocument(nextVirtualDocumentIndex);

    if (nextDocument === undefined) {
      reset();
      return toDocumentPath(-1);
    }

    setVirtualDocumentIndex(nextVirtualDocumentIndex);
    const nextVedleggIndex = getHasVisibleVedlegg(nextDocument) ? getLastIndex(nextDocument.vedlegg) : -1;
    setFocusedVedleggIndex(nextVedleggIndex);
    return toDocumentPath(nextVirtualDocumentIndex, nextVedleggIndex);
  };

  const home = () => {
    if (isInVedleggList) {
      setFocusedVedleggIndex(0);
      return;
    }

    setVirtualDocumentIndex(0);
    setFocusedVedleggIndex(-1);
  };

  const end = () => {
    if (isInVedleggList) {
      setFocusedVedleggIndex(lastVedleggIndex);
      return;
    }

    const lastDocument = getDocument(lastVirtualDocumentIndex);
    setVirtualDocumentIndex(lastVirtualDocumentIndex);
    setFocusedVedleggIndex(getLastIndex(lastDocument?.vedlegg));
  };

  const reset = useCallback(() => {
    if (selectedCount > 0) {
      unselectAll();
      return;
    }

    if (shownDocuments.length > 0) {
      setShownDocuments([]);
      return;
    }

    setVirtualDocumentIndex(-1);
    setFocusedVedleggIndex(-1);
    scrollToTop();
  }, [shownDocuments.length, setShownDocuments, selectedCount, unselectAll, scrollToTop]);

  const collapseVedlegg = () => {
    if (isInVedleggList) {
      // Focus document.
      setFocusedVedleggIndex(-1);
      return;
    }

    if (hasDocument) {
      // Collapse vedlegg list.
      setShowVedleggIdList(showVedleggIdList.filter((id) => id !== focusedDocument.journalpostId));
    }
  };
  const expandVedlegg = () => {
    if (isOnDocument && !showVedleggIdList.includes(focusedDocument.journalpostId)) {
      setShowVedleggIdList([...showVedleggIdList, focusedDocument.journalpostId]);
    }
  };

  const collapseAllVedlegg = () => setShowVedleggIdList([]);

  const expandAllVedlegg = () =>
    setShowVedleggIdList(documents.filter((d) => d.vedlegg.length > 0).map((d) => d.journalpostId));

  const toggleSelect = () => {
    if (!hasDocument || !focusedDocument.hasAccess) {
      return;
    }

    if (!isInVedleggList) {
      isSelected(focusedDocument) ? unselectOne(focusedDocument) : selectOne(focusedDocument);
    }

    const vedlegg = focusedDocument.vedlegg[focusedVedleggIndex];

    if (vedlegg === undefined) {
      return;
    }

    const id: IJournalfoertDokumentId = {
      journalpostId: focusedDocument.journalpostId,
      dokumentInfoId: vedlegg.dokumentInfoId,
    };

    isSelected(id) ? unselectOne(id) : selectOne(id);
  };

  const toggleSelectAll = () => (selectedCount > 0 ? unselectAll() : selectMany(allSelectableDocuments));

  const selectDown = (amount = 1) => {
    const beforePath = toDocumentPath();
    const afterPath = down(amount);
    selectRange(beforePath, afterPath);
  };

  const selectUp = (amount = 1) => {
    const beforePath = toDocumentPath();
    const afterPath = up(amount);
    selectRange(beforePath, afterPath);
  };

  const toggleInfo = () => {
    if (!hasDocument) {
      return;
    }

    const { journalpostId } = focusedDocument;

    setShowMetadataIdList((ids) =>
      ids.includes(journalpostId) ? ids.filter((id) => id !== journalpostId) : [...ids, journalpostId],
    );
  };

  const toggleInclude = () => {
    if (oppgaveId === skipToken || !hasDocument) {
      return;
    }

    if (selectedCount > 0 && isSelected(focusedDocument)) {
      const selected = getSelectedDocuments().filter((d) => d.hasAccess && d.journalstatus !== Journalstatus.MOTTATT);
      const selectedAndIncluded = selected.filter((d) => d.valgt);

      // If all documents are selected, remove all.
      if (selectedAndIncluded.length === selected.length) {
        if (documents.filter((d) => d.valgt).length === selected.length) {
          // Remove all documents.
          removeAllIncludedDocuments({ oppgaveId });
          return;
        }

        // Remove only selected documents.
        for (const { journalpostId, dokumentInfoId } of selectedAndIncluded) {
          removeIncludedDocument({ oppgaveId, journalpostId, dokumentInfoId });
        }

        return;
      }

      // If not all documents are selected, add missing.
      for (const { journalpostId, dokumentInfoId, valgt } of selected) {
        if (!valgt) {
          tilknyttDocument({ oppgaveId, journalpostId, dokumentInfoId });
        }
      }

      return;
    }

    if (focusedDocument.journalstatus === Journalstatus.MOTTATT) {
      return;
    }

    const { journalpostId } = focusedDocument;

    const currentVedlegg = isInVedleggList ? focusedDocument.vedlegg[focusedVedleggIndex] : undefined;

    if (currentVedlegg !== undefined) {
      const { dokumentInfoId } = currentVedlegg;

      if (!currentVedlegg.hasAccess) {
        return;
      }

      currentVedlegg.valgt
        ? removeIncludedDocument({ oppgaveId, journalpostId, dokumentInfoId })
        : tilknyttDocument({ oppgaveId, journalpostId, dokumentInfoId });

      return;
    }

    if (!focusedDocument.hasAccess) {
      return;
    }

    const { dokumentInfoId } = focusedDocument;

    focusedDocument.valgt
      ? removeIncludedDocument({ oppgaveId, journalpostId, dokumentInfoId })
      : tilknyttDocument({ oppgaveId, journalpostId, dokumentInfoId });
  };

  const { getTabRef, setTabRef } = useContext(TabContext);

  const openInline = useCallback(async () => {
    if (!hasDocument) {
      return;
    }

    if (selectedCount > 0 && isSelected(focusedDocument)) {
      const selectedDocumentsInOrder = getSelectedDocumentsInOrder(selectedDocuments, documents, selectedCount);

      if (
        selectedDocumentsInOrder.length === shownDocuments.length &&
        shownDocuments.every((d) => d.type === DocumentTypeEnum.JOURNALFOERT && selectedDocuments.has(getId(d)))
      ) {
        // If all selected documents are already open, close them.
        setShownDocuments([]);
        return;
      }

      setShownDocuments(selectedDocumentsInOrder);
      return;
    }

    if (!focusedDocument.hasAccess) {
      return;
    }

    const { journalpostId } = focusedDocument;
    let dokumentInfoId = focusedDocument.dokumentInfoId;

    if (isInVedleggList) {
      const vedlegg = focusedDocument.vedlegg[focusedVedleggIndex];

      if (vedlegg === undefined || !vedlegg.hasAccess) {
        return;
      }

      dokumentInfoId = vedlegg.dokumentInfoId;
    }

    // If exactly this document is open, and no other, close it.
    const isOpen =
      shownDocuments.length === 1 &&
      shownDocuments.every(
        (d) =>
          d.type === DocumentTypeEnum.JOURNALFOERT &&
          d.dokumentInfoId === dokumentInfoId &&
          d.journalpostId === journalpostId,
      );

    if (isOpen) {
      setShownDocuments([]);
      return;
    }

    // If nothing or other documents are open, open this one.
    setShownDocuments([
      {
        type: DocumentTypeEnum.JOURNALFOERT,
        dokumentInfoId,
        journalpostId,
      },
    ]);
  }, [
    hasDocument,
    isInVedleggList,
    focusedVedleggIndex,
    focusedDocument,
    setShownDocuments,
    shownDocuments,
    selectedCount,
    selectedDocuments,
    documents,
    isSelected,
  ]);

  const openNewTab = useCallback(async () => {
    if (!hasDocument) {
      return;
    }

    if (selectedCount > 0 && isSelected(focusedDocument)) {
      const documentsToCombine = getSelectedDocumentsInOrder(selectedDocuments, documents, selectedCount);
      const { reference } = await getMergedDocumentRef(documentsToCombine).unwrap();
      const tabUrl = getMergedDocumentTabUrl(reference);
      const documentId = getMergedDocumentTabId(reference);

      const isTabOpen = TAB_MANAGER.isTabOpen(documentId);
      const tabRef = getTabRef(documentId);

      // There is a reference to the tab and it is open.
      if (tabRef !== undefined && !tabRef.closed) {
        tabRef.focus();

        return;
      }

      if (isTabOpen) {
        toast.warning('Dokumentet er allerede åpent i en annen fane');

        return;
      }

      const newTabRef = window.open(tabUrl, documentId);

      if (newTabRef === null) {
        toast.error('Kunne ikke åpne ny fane');

        return;
      }

      setTabRef(documentId, newTabRef);
      return;
    }

    if (!focusedDocument.hasAccess) {
      return;
    }

    const { journalpostId } = focusedDocument;
    let dokumentInfoId = focusedDocument.dokumentInfoId;

    if (isInVedleggList) {
      const vedlegg = focusedDocument.vedlegg[focusedVedleggIndex];

      if (vedlegg === undefined || !vedlegg.hasAccess) {
        return;
      }

      dokumentInfoId = vedlegg.dokumentInfoId;
    }

    const documentId = getJournalfoertDocumentTabId(journalpostId, dokumentInfoId);
    const isTabOpen = TAB_MANAGER.isTabOpen(documentId);
    const tabRef = getTabRef(documentId);

    // There is a reference to the tab and it is open.
    if (tabRef !== undefined && !tabRef.closed) {
      tabRef.focus();

      return;
    }

    if (isTabOpen) {
      toast.warning('Dokumentet er allerede åpent i en annen fane');

      return;
    }

    const href = getJournalfoertDocumentTabUrl(journalpostId, dokumentInfoId);

    // There is no reference to the tab or it is closed.
    const newTabRef = window.open(href, documentId);

    if (newTabRef === null) {
      toast.error('Kunne ikke åpne dokument i ny fane');

      return;
    }

    setTabRef(documentId, newTabRef);
  }, [
    hasDocument,
    focusedDocument,
    isInVedleggList,
    focusedVedleggIndex,
    getTabRef,
    setTabRef,
    selectedCount,
    selectedDocuments,
    documents,
    getMergedDocumentRef,
    isSelected,
  ]);

  return (
    <KeyboardContext.Provider
      value={{
        down,
        up,
        home,
        end,
        reset,

        selectDown,
        selectUp,
        collapseVedlegg,
        expandVedlegg,
        collapseAllVedlegg,
        expandAllVedlegg,
        toggleSelect,
        toggleSelectAll,
        toggleInfo,
        toggleInclude,
        toggleShowIncludeOnly: () => setShowOnlyIncludedDocuments((prev = false) => !prev),
        setAsAttachmentTo: () => attachmentModalRef.current?.showModal(),
        rename: () => renameModalRef.current?.showModal(),
        openInline,
        openNewTab,

        focusedDocumentIndex: toRealDocumentIndex(virtualDocumentIndex),
        focusedVedleggIndex,
      }}
    >
      {children}

      <AttachmentModal focusedDocument={focusedDocument} focusedVedlegg={focusedVedlegg} ref={attachmentModalRef} />
      <RenameModal focusedDocument={focusedDocument} focusedVedlegg={focusedVedlegg} ref={renameModalRef} />
    </KeyboardContext.Provider>
  );
};

const useValidDocumentIndexes = (documents: IArkivertDocument[]): number[] =>
  useMemo(() => {
    const indexes: number[] = [];

    documents.forEach((d, i) => {
      if (d.hasAccess) {
        indexes.push(i);
      }
    });

    return indexes;
  }, [documents]);
