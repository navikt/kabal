import { useSetAsAttachmentTo } from '@app/components/documents/journalfoerte-documents/keyboard/actions/attachment';
import { useDown } from '@app/components/documents/journalfoerte-documents/keyboard/actions/down';
import { home, useEnd } from '@app/components/documents/journalfoerte-documents/keyboard/actions/home-end';
import { useToggleInclude } from '@app/components/documents/journalfoerte-documents/keyboard/actions/include';
import { useToggleInfo } from '@app/components/documents/journalfoerte-documents/keyboard/actions/info';
import { useOpenInline } from '@app/components/documents/journalfoerte-documents/keyboard/actions/open-inline';
import { useOpenInNewTab } from '@app/components/documents/journalfoerte-documents/keyboard/actions/open-tab';
import {
  useSelectDown,
  useSelectEnd,
  useSelectHome,
  useSelectUp,
  useToggleSelect,
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
import { KeyboardHelpModal } from '@app/components/documents/journalfoerte-documents/keyboard/keyboard-help-modal';
import { RenameModal } from '@app/components/documents/journalfoerte-documents/keyboard/rename-modal';
import { resetIndexes } from '@app/components/documents/journalfoerte-documents/keyboard/state/focus';
import { useDocumentsOnlyIncluded, useHasSeenKeyboardShortcuts } from '@app/hooks/settings/use-setting';
import type { IArkivertDocument } from '@app/types/arkiverte-documents';
import type { IJournalfoertDokumentId } from '@app/types/oppgave-common';
import { createContext, useCallback, useContext, useRef, useState } from 'react';

const NOOP = () => {};

interface KeyboardContextType {
  // Navigation
  up: () => void;
  down: () => void;
  home: () => void;
  end: () => void;
  reset: () => void;

  // Actions
  selectUp: () => void;
  selectDown: () => void;
  selectHome: () => void;
  selectEnd: () => void;
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
  openInNewTab: () => void;
  focusSearch: () => void;

  showHelpModal: () => void;
}

const KeyboardContext = createContext<KeyboardContextType>({
  // Navigation
  up: NOOP,
  down: NOOP,
  home: NOOP,
  end: NOOP,
  reset: NOOP,

  // Actions
  selectDown: NOOP,
  selectUp: NOOP,
  selectEnd: NOOP,
  selectHome: NOOP,
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
  openInNewTab: NOOP,
  focusSearch: NOOP,

  // Help
  showHelpModal: NOOP,
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
  allSelectableDocuments: IJournalfoertDokumentId[];
  scrollToTop: () => void;
  searchRef: React.RefObject<HTMLInputElement | null>;
}

export const KeyboardContextElement = ({
  children,
  filteredDocuments,
  allSelectableDocuments,
  scrollToTop,
  searchRef,
}: KeyboardContextElementProps) => {
  const { setValue: setShowOnlyIncludedDocuments } = useDocumentsOnlyIncluded();

  useClampOnFilter(filteredDocuments);

  const down = useDown(filteredDocuments);
  const up = useUp(filteredDocuments);
  const end = useEnd(filteredDocuments);

  const reset = useCallback(() => {
    resetIndexes();
    scrollToTop();
  }, [scrollToTop]);

  const collapseVedlegg = useCollapseVedlegg(filteredDocuments);
  const expandVedlegg = useExpandVedlegg(filteredDocuments);
  const expandAllVedlegg = useExpandAllVedlegg(filteredDocuments);

  const toggleSelect = useToggleSelect(filteredDocuments);
  const toggleSelectAll = useToggleSelectAll(allSelectableDocuments);
  const selectDown = useSelectDown(filteredDocuments);
  const selectUp = useSelectUp(filteredDocuments);
  const selectHome = useSelectHome();
  const selectEnd = useSelectEnd(filteredDocuments);

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

  const setAsAttachmentTo = useSetAsAttachmentTo(filteredDocuments, setAttachmentModal);
  const rename = useCallback(() => setRenameModal(true), []);

  const { setValue: setHasSeenKeyboardShortcuts } = useHasSeenKeyboardShortcuts();

  const helpModalRef = useRef<HTMLDialogElement>(null);

  const showHelpModal = useCallback(() => {
    helpModalRef.current?.showModal();
    setHasSeenKeyboardShortcuts(true);
  }, [setHasSeenKeyboardShortcuts]);

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
        reset,

        selectDown,
        selectUp,
        selectHome,
        selectEnd,
        collapseVedlegg,
        expandVedlegg,
        collapseAllVedlegg,
        expandAllVedlegg,
        toggleSelect,
        toggleSelectAll,
        toggleInfo,
        toggleInclude,
        toggleShowIncludeOnly,
        setAsAttachmentTo,
        rename,
        openInline,
        openInNewTab,
        focusSearch,

        showHelpModal,
      }}
    >
      {children}

      <KeyboardHelpModal ref={helpModalRef} />

      <AttachmentModal
        open={attachmentModal}
        onClose={() => setAttachmentModal(false)}
        filteredDocuments={filteredDocuments}
      />

      <RenameModal open={renameModal} onClose={() => setRenameModal(false)} filteredDocuments={filteredDocuments} />
    </KeyboardContext.Provider>
  );
};
