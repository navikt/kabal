import { useDown } from '@app/components/documents/journalfoerte-documents/keyboard/actions/down';
import { home, useEnd } from '@app/components/documents/journalfoerte-documents/keyboard/actions/home-end';
import { useToggleInclude } from '@app/components/documents/journalfoerte-documents/keyboard/actions/include';
import { useToggleInfo } from '@app/components/documents/journalfoerte-documents/keyboard/actions/info';
import { useOpenInline } from '@app/components/documents/journalfoerte-documents/keyboard/actions/open-inline';
import { useOpenInNewTab } from '@app/components/documents/journalfoerte-documents/keyboard/actions/open-tab';
import {
  useSelectEnd,
  useToggleSelectAll,
} from '@app/components/documents/journalfoerte-documents/keyboard/actions/select';
import { useUp } from '@app/components/documents/journalfoerte-documents/keyboard/actions/up';
import {
  collapseAllVedlegg,
  useCollapseVedlegg,
  useExpandAllVedlegg,
  useExpandVedlegg,
} from '@app/components/documents/journalfoerte-documents/keyboard/actions/vedlegg';
import { AttachmentModal } from '@app/components/documents/journalfoerte-documents/keyboard/attachment-modal';
import { useClampOnFilter } from '@app/components/documents/journalfoerte-documents/keyboard/hooks/clamp-on-filter';
import { getDocument, getVedlegg } from '@app/components/documents/journalfoerte-documents/keyboard/hooks/get-document';
import { KeyboardHelpModal } from '@app/components/documents/journalfoerte-documents/keyboard/keyboard-help-modal';
import { RenameModal } from '@app/components/documents/journalfoerte-documents/keyboard/rename-modal';
import { getFocusIndex } from '@app/components/documents/journalfoerte-documents/keyboard/state/focus';
import {
  getSelectionRanges,
  selectRangeTo,
} from '@app/components/documents/journalfoerte-documents/keyboard/state/selection';
import { getRangeStartAndEnd } from '@app/components/documents/journalfoerte-documents/select-context/range-utils';
import { useDocumentsOnlyIncluded } from '@app/hooks/settings/use-setting';
import type { IArkivertDocument } from '@app/types/arkiverte-documents';
import { createContext, useCallback, useContext, useState } from 'react';

const NOOP = () => {};

interface KeyboardContextType {
  // Navigation
  up: () => void;
  down: () => void;
  home: () => void;
  end: () => void;

  // Actions
  selectTo: () => void;
  selectEnd: () => void;
  collapseVedlegg: () => void;
  expandVedlegg: () => void;
  collapseAllVedlegg: () => void;
  expandAllVedlegg: () => void;
  toggleInfo: () => void;
  toggleInclude: () => void;
  toggleShowIncludeOnly: () => void;
  toggleSelectAll: () => void;
  setAsAttachmentTo: () => void;
  rename: () => void;
  copyName: () => void;
  openInline: () => void;
  openInNewTab: () => void;
  focusSearch: () => void;
}

const KeyboardContext = createContext<KeyboardContextType>({
  // Navigation
  up: NOOP,
  down: NOOP,
  home: NOOP,
  end: NOOP,

  // Actions
  selectTo: NOOP,
  selectEnd: NOOP,
  collapseVedlegg: NOOP,
  expandVedlegg: NOOP,
  collapseAllVedlegg: NOOP,
  expandAllVedlegg: NOOP,
  toggleInfo: NOOP,
  toggleInclude: NOOP,
  toggleShowIncludeOnly: NOOP,
  toggleSelectAll: NOOP,
  setAsAttachmentTo: NOOP,
  rename: NOOP,
  copyName: NOOP,
  openInline: NOOP,
  openInNewTab: NOOP,
  focusSearch: NOOP,
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
  filteredDocuments: IArkivertDocument[];
  searchRef: React.RefObject<HTMLInputElement | null>;
}

export const KeyboardContextElement = ({ children, filteredDocuments, searchRef }: KeyboardContextElementProps) => {
  const { setValue: setShowOnlyIncludedDocuments } = useDocumentsOnlyIncluded();

  useClampOnFilter();

  const down = useDown();
  const up = useUp();
  const end = useEnd(filteredDocuments);

  const selectTo = useCallback(() => {
    const ranges = getSelectionRanges();
    const lastRange = ranges.at(-1);
    const focusedIndex = getFocusIndex();

    if (lastRange === undefined) {
      return selectRangeTo(focusedIndex);
    }

    const [start, end] = getRangeStartAndEnd(lastRange);

    const startDiff = Math.abs(start - focusedIndex);
    const endDiff = Math.abs(end - focusedIndex);
    const closest = startDiff < endDiff ? start : end;

    selectRangeTo(focusedIndex, closest);
  }, []);

  const selectEnd = useSelectEnd(filteredDocuments);

  const collapseVedlegg = useCollapseVedlegg(filteredDocuments);
  const expandVedlegg = useExpandVedlegg(filteredDocuments);
  const expandAllVedlegg = useExpandAllVedlegg(filteredDocuments);

  const toggleSelectAll = useToggleSelectAll();

  const toggleInfo = useToggleInfo(filteredDocuments);
  const toggleInclude = useToggleInclude(filteredDocuments);
  const openInline = useOpenInline(filteredDocuments);
  const openInNewTab = useOpenInNewTab(filteredDocuments);

  const toggleShowIncludeOnly = useCallback(
    () => setShowOnlyIncludedDocuments((prev = false) => !prev),
    [setShowOnlyIncludedDocuments],
  );

  const [attachmentModal, setAttachmentModal] = useState(false);
  const [renameModal, setRenameModal] = useState(false);

  const setAsAttachmentTo = () => setAttachmentModal(true);
  const rename = useCallback(() => setRenameModal(true), []);

  const copyName = useCallback(() => {
    const document = getDocument(filteredDocuments);

    if (document === undefined) {
      return;
    }

    const vedlegg = getVedlegg(document);
    const name = vedlegg === undefined ? document.tittel : vedlegg.tittel;

    if (name !== null) {
      navigator.clipboard.writeText(name);
    }
  }, [filteredDocuments]);

  const focusSearch = useCallback(() => {
    if (searchRef.current === null) {
      return;
    }

    searchRef.current.focus();
  }, [searchRef.current]);

  return (
    <KeyboardContext.Provider
      value={{
        down,
        up,
        home,
        end,

        selectEnd,
        selectTo,
        collapseVedlegg,
        expandVedlegg,
        collapseAllVedlegg,
        expandAllVedlegg,
        toggleSelectAll,
        toggleInfo,
        toggleInclude,
        toggleShowIncludeOnly,
        setAsAttachmentTo,
        rename,
        copyName,
        openInline,
        openInNewTab,
        focusSearch,
      }}
    >
      {children}

      <KeyboardHelpModal />

      <AttachmentModal
        open={attachmentModal}
        onClose={() => setAttachmentModal(false)}
        filteredDocuments={filteredDocuments}
      />

      <RenameModal open={renameModal} onClose={() => setRenameModal(false)} filteredDocuments={filteredDocuments} />
    </KeyboardContext.Provider>
  );
};
