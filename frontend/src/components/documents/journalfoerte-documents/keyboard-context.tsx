import { SelectContext } from '@app/components/documents/journalfoerte-documents/select-context/select-context';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useRemoveTilknyttetDocumentMutation } from '@app/redux-api/oppgaver/mutations/remove-tilknytt-document';
import { useTilknyttDocumentMutation } from '@app/redux-api/oppgaver/mutations/tilknytt-document';
import type { IArkivertDocument } from '@app/types/arkiverte-documents';
import { skipToken } from '@reduxjs/toolkit/query';
import { createContext, useCallback, useContext, useState } from 'react';

const NOOP = () => {};

export const KeyboardContext = createContext<{
  // Navigation
  up: () => void;
  down: () => void;
  pageUp: () => void;
  pageDown: () => void;
  home: () => void;
  end: () => void;
  reset: () => void;
  focus: () => void;

  // Actions
  left: () => void;
  right: () => void;
  toggleVedlegg: () => void;
  toggleAllVedlegg: () => void;
  toggleInfo: () => void;
  toggleAllInfo: () => void;
  toggleInclude: () => void;
  toggleSelect: () => void;
  rename: () => void;
  openInline: () => void;
  openNewTab: () => void;

  // State
  activeDocument: number;
  activeVedlegg: number;
}>({
  // Navigation
  up: NOOP,
  down: NOOP,
  pageUp: NOOP,
  pageDown: NOOP,
  home: NOOP,
  end: NOOP,
  reset: NOOP,
  focus: NOOP,

  // Actions
  left: NOOP,
  right: NOOP,
  toggleVedlegg: NOOP,
  toggleAllVedlegg: NOOP,
  toggleInfo: NOOP,
  toggleAllInfo: NOOP,
  toggleInclude: NOOP,
  toggleSelect: NOOP,
  rename: NOOP,
  openInline: NOOP,
  openNewTab: NOOP,

  // State
  activeDocument: -1,
  activeVedlegg: -1,
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
  showVedleggIdList: string[];
  setShowVedleggIdList: (ids: string[] | ((ids: string[]) => string[])) => void;
  setShowMetadataIdList: (ids: string[] | ((ids: string[]) => string[])) => void;
}

export const KeyboardContextElement = ({
  children,
  documents,
  showVedleggIdList,
  setShowVedleggIdList,
  setShowMetadataIdList,
}: KeyboardContextElementProps) => {
  const oppgaveId = useOppgaveId();
  const { selectOne, unselectOne, isSelected } = useContext(SelectContext);
  const [tilknyttDocument] = useTilknyttDocumentMutation();
  const [removeDocument] = useRemoveTilknyttetDocumentMutation();
  const [activeDocumentIndex, setActiveDocumentIndex] = useState<number>(-1);
  const [activeVedleggIndex, setActiveVedleggIndex] = useState<number>(-1);

  const isInVedleggList = activeVedleggIndex !== -1;
  const lastDocumentIndex = documents.length - 1;
  const document = documents[activeDocumentIndex];
  const hasDocument = document !== undefined;
  const isOnDocument = hasDocument && !isInVedleggList;
  const lastVedleggIndex = document?.vedlegg.length ?? -1;

  console.debug(`[${activeDocumentIndex}/${documents.length}, ${activeVedleggIndex}/${document?.vedlegg.length ?? 0}]`);

  const getHasVisibleVedlegg = ({ vedlegg, journalpostId }: IArkivertDocument) =>
    vedlegg.length > 0 && showVedleggIdList.includes(journalpostId);

  const down = (amount = 1) => {
    if (activeDocumentIndex === -1) {
      setActiveDocumentIndex(0);
      return;
    }

    if (document === undefined) {
      return;
    }

    if (activeVedleggIndex !== lastVedleggIndex && getHasVisibleVedlegg(document)) {
      setActiveVedleggIndex(Math.min(activeVedleggIndex + amount, lastVedleggIndex));
      return;
    }

    setActiveDocumentIndex(increment(activeDocumentIndex, amount, lastDocumentIndex));
  };

  const up = (amount = 1) => {
    if (isInVedleggList) {
      setActiveVedleggIndex(activeVedleggIndex === 0 ? -1 : Math.max(activeVedleggIndex - amount, 0));
      return;
    }

    const nextDocumentIndex = decrement(activeDocumentIndex, amount, lastDocumentIndex);
    const nextDocument = documents[nextDocumentIndex];

    if (nextDocument === undefined) {
      return;
    }

    setActiveDocumentIndex(nextDocumentIndex);
    setActiveVedleggIndex(getHasVisibleVedlegg(nextDocument) ? nextDocument.vedlegg.length - 1 : -1);
  };

  const pageUp = () => up(10);
  const pageDown = () => down(10);

  const homeEndFn = isInVedleggList ? setActiveVedleggIndex : setActiveDocumentIndex;
  const home = () => homeEndFn(0);
  const end = () => homeEndFn(isInVedleggList ? lastVedleggIndex : lastDocumentIndex);

  const reset = useCallback(() => {
    setActiveDocumentIndex(-1);
    setActiveVedleggIndex(-1);
  }, []);

  const left = () => {
    if (isInVedleggList) {
      // Focus document.
      setActiveVedleggIndex(-1);
      return;
    }

    if (hasDocument) {
      // Collapse vedlegg list.
      setShowVedleggIdList(showVedleggIdList.filter((id) => id !== document.journalpostId));
    }
  };
  const right = () => {
    if (isOnDocument && !showVedleggIdList.includes(document.journalpostId)) {
      setShowVedleggIdList([...showVedleggIdList, document.journalpostId]);
    }
  };

  const toggleVedlegg = () => {
    if (!hasDocument) {
      return;
    }

    if (showVedleggIdList.includes(document.journalpostId)) {
      setShowVedleggIdList(showVedleggIdList.filter((id) => id !== document.journalpostId));
      setActiveVedleggIndex(-1);
    } else {
      setShowVedleggIdList([...showVedleggIdList, document.journalpostId]);
    }
  };

  const toggleAllVedlegg = () => {
    if (showVedleggIdList.length > 0) {
      setShowVedleggIdList([]);
      return;
    }

    setShowVedleggIdList(documents.filter((d) => d.vedlegg.length > 0).map((d) => d.journalpostId));
  };

  const toggleAllInfo = () =>
    setShowMetadataIdList((prev) => (prev.length > 0 ? [] : documents.map((d) => d.journalpostId)));

  const toggleSelect = () => {
    if (!hasDocument || !document.harTilgangTilArkivvariant) {
      return;
    }

    if (!isInVedleggList) {
      console.debug(
        'toggleSelect',
        activeDocumentIndex,
        documents,
        documents[activeDocumentIndex],
        document.journalpostId,
        document.dokumentInfoId,
      );
      isSelected(document) ? unselectOne(document) : selectOne(document);
    }

    const vedlegg = document.vedlegg[activeVedleggIndex];

    if (vedlegg === undefined) {
      return;
    }

    const id = {
      journalpostId: document.journalpostId,
      dokumentInfoId: vedlegg.dokumentInfoId,
    };

    isSelected(id) ? unselectOne(id) : selectOne(id);
  };

  const toggleInfo = () => {
    if (!hasDocument) {
      return;
    }

    const { journalpostId } = document;

    setShowMetadataIdList((ids) =>
      ids.includes(journalpostId) ? ids.filter((id) => id !== journalpostId) : [...ids, journalpostId],
    );
  };

  const toggleInclude = () => {
    if (!hasDocument || oppgaveId === skipToken) {
      return;
    }

    const { journalpostId } = document;

    const currentVedlegg = isInVedleggList ? document.vedlegg[activeVedleggIndex] : undefined;

    if (currentVedlegg !== undefined) {
      const { dokumentInfoId } = currentVedlegg;

      currentVedlegg.valgt
        ? removeDocument({ oppgaveId, journalpostId, dokumentInfoId })
        : tilknyttDocument({ oppgaveId, journalpostId, dokumentInfoId });

      return;
    }

    const { dokumentInfoId } = document;

    document.valgt
      ? removeDocument({ oppgaveId, journalpostId, dokumentInfoId })
      : tilknyttDocument({ oppgaveId, journalpostId, dokumentInfoId });
  };

  const focus = () => {
    // TODO: Implement focus document title.
  };

  const openInline = useCallback(() => {
    // Handle key press events
  }, []);

  const openNewTab = useCallback(() => {
    // Handle key press events
  }, []);

  return (
    <KeyboardContext.Provider
      value={{
        down,
        up,
        home,
        end,
        pageUp,
        pageDown,
        reset,
        focus,

        left,
        right,
        toggleVedlegg,
        toggleAllVedlegg,
        toggleSelect,
        toggleInfo,
        toggleAllInfo,
        toggleInclude,
        rename: () => {},
        openInline,
        openNewTab,

        activeDocument: activeDocumentIndex,
        activeVedlegg: activeVedleggIndex,
      }}
    >
      {children}
    </KeyboardContext.Provider>
  );
};

const increment = (prev: number, amount: number, max: number) => {
  if (prev === -1) {
    return 0;
  }

  if (prev + amount >= max - 1) {
    return 0;
  }

  return prev + amount;
};

const decrement = (prev: number, amount: number, max: number) => {
  if (prev - amount < 0) {
    return max;
  }

  return prev - amount;
};
