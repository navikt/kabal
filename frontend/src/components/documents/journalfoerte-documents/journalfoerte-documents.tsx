import type {
  DokumentRenderData,
  VedleggRenderData,
} from '@app/components/documents/journalfoerte-documents/calculate';
import { DocumentList } from '@app/components/documents/journalfoerte-documents/document-list';
import { Header } from '@app/components/documents/journalfoerte-documents/header/header';
import {
  KeyboardContextElement,
  useKeyboardContext,
} from '@app/components/documents/journalfoerte-documents/keyboard/keyboard-context';
import { useKeyboard } from '@app/components/documents/journalfoerte-documents/keyboard/use-keyboard';
import { SelectContextElement } from '@app/components/documents/journalfoerte-documents/select-context/select-context';
import { useShowLogiskeVedlegg } from '@app/components/documents/journalfoerte-documents/state/show-logiske-vedlegg';
import { useShowVedlegg } from '@app/components/documents/journalfoerte-documents/state/show-vedlegg';
import { clamp } from '@app/functions/clamp';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { Keys, isMetaKey } from '@app/keys';
import { useGetArkiverteDokumenterQuery } from '@app/redux-api/oppgaver/queries/documents';
import type { IArkivertDocument } from '@app/types/arkiverte-documents';
import type { IJournalfoertDokumentId } from '@app/types/oppgave-common';
import { VStack } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useFilters } from './header/use-filters';
import { JournalfoertHeading } from './heading/heading';

const EMPTY_ARRAY: IArkivertDocument[] = [];
const EMPTY_ID_LIST: string[] = [];

export const JournalfoerteDocuments = () => {
  const oppgaveId = useOppgaveId();
  const { data, isLoading } = useGetArkiverteDokumenterQuery(oppgaveId ?? skipToken);
  const [listHeight, setListHeight] = useState<number>(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const documents = data?.dokumenter ?? EMPTY_ARRAY;

  const filters = useFilters(documents);
  const { resetFilters, noFiltersActive, totalFilteredDocuments } = filters;

  const allSelectableDocuments = useMemo<IJournalfoertDokumentId[]>(() => {
    const selectable: IJournalfoertDokumentId[] = [];

    for (const doc of totalFilteredDocuments) {
      if (doc.hasAccess) {
        selectable.push({ journalpostId: doc.journalpostId, dokumentInfoId: doc.dokumentInfoId });
      }

      for (const vedlegg of doc.vedlegg) {
        if (vedlegg.hasAccess) {
          selectable.push({ journalpostId: doc.journalpostId, dokumentInfoId: vedlegg.dokumentInfoId });
        }
      }
    }

    return selectable;
  }, [totalFilteredDocuments]);

  const documentsWithVedleggIdList = useMemo<string[]>(() => {
    const journalpostIdList: string[] = [];

    for (const d of documents) {
      if (d.hasAccess && (d.vedlegg.length > 0 || d.logiskeVedlegg.length > 0)) {
        journalpostIdList.push(d.journalpostId);
      }
    }

    return journalpostIdList;
  }, [documents]);

  const { showVedleggIdList, setShowVedleggIdList } = useShowVedlegg();

  useEffect(() => {
    setShowVedleggIdList(documentsWithVedleggIdList);
  }, [documentsWithVedleggIdList, setShowVedleggIdList]);

  // IDs of vedlegg with logiske vedlegg.
  const vedleggWithLogiskeVedleggIdList = useMemo<string[]>(
    () =>
      documents.reduce<string[]>((dokumentInfoIdList, d) => {
        for (const vedlegg of d.vedlegg) {
          if (vedlegg.logiskeVedlegg.length > 0 && !dokumentInfoIdList.includes(vedlegg.dokumentInfoId)) {
            dokumentInfoIdList.push(`${d.journalpostId}-${vedlegg.dokumentInfoId}`);
          }
        }

        return dokumentInfoIdList;
      }, []),
    [documents],
  );

  const { showLogiskeVedleggIdList, setShowLogiskeVedleggIdList } = useShowLogiskeVedlegg();

  useEffect(() => {
    if (showLogiskeVedleggIdList !== EMPTY_ID_LIST || vedleggWithLogiskeVedleggIdList.length === 0) {
      return;
    }

    setShowLogiskeVedleggIdList(vedleggWithLogiskeVedleggIdList);
  }, [showLogiskeVedleggIdList, vedleggWithLogiskeVedleggIdList, setShowLogiskeVedleggIdList]);

  const showsAnyVedlegg = showVedleggIdList.length > 0 || showLogiskeVedleggIdList.length > 0;

  const onToggle = useCallback(() => {
    setShowVedleggIdList(showsAnyVedlegg ? [] : documentsWithVedleggIdList);
    setShowLogiskeVedleggIdList(showsAnyVedlegg ? [] : vedleggWithLogiskeVedleggIdList);
  }, [
    documentsWithVedleggIdList,
    showsAnyVedlegg,
    vedleggWithLogiskeVedleggIdList,
    setShowVedleggIdList,
    setShowLogiskeVedleggIdList,
  ]);

  const [scrollTop, setScrollTop] = useState(0);
  const onScroll: React.UIEventHandler<HTMLDivElement> = useCallback(({ currentTarget }) => {
    requestIdleCallback(
      () => {
        const clamped = clamp(currentTarget.scrollTop, 0, currentTarget.scrollHeight - currentTarget.clientHeight); // Elastic scrolling in Safari can exceed the boundaries.
        setScrollTop(clamped);
      },
      { timeout: 100 },
    );
  }, []);

  useEffect(() => {
    const callback = () => {
      const h = scrollContainerRef.current?.clientHeight ?? 0;
      setListHeight(h);
    };

    callback();

    const resizeObserver = new ResizeObserver(callback);

    if (scrollContainerRef.current !== null) {
      resizeObserver.observe(scrollContainerRef.current);

      return () => resizeObserver.disconnect();
    }
  }, []);

  const onScrollTo = useCallback((d: DokumentRenderData | VedleggRenderData) => {
    if (scrollContainerRef.current === null) {
      return;
    }

    if (d.globalTop < scrollContainerRef.current.scrollTop + 32) {
      scrollContainerRef.current.scrollTo({ top: Math.max(d.globalTop - 16, 0), behavior: 'auto' });
      return;
    }

    const scrollBottom = scrollContainerRef.current.scrollTop + scrollContainerRef.current.clientHeight - 48;
    const globalBottom = d.globalTop + d.height + 4;

    if (globalBottom > scrollBottom) {
      scrollContainerRef.current.scrollTo({
        top: clamp(globalBottom - scrollContainerRef.current.clientHeight + 48 + 4, 0, d.globalTop),
        behavior: 'auto',
      });
    }
  }, []);

  const scrollToTop = useCallback(() => {
    if (scrollContainerRef.current === null) {
      return;
    }

    scrollContainerRef.current.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  const searchRef = useRef<HTMLInputElement>(null);

  return (
    <SelectContextElement allDocumentsList={documents} filteredDocumentsList={totalFilteredDocuments}>
      <KeyboardContextElement
        filteredDocuments={totalFilteredDocuments}
        allSelectableDocuments={allSelectableDocuments}
        scrollToTop={scrollToTop}
        searchRef={searchRef}
      >
        <KeyboardBoundary>
          <JournalfoertHeading
            allDocuments={documents}
            totalLengthOfMainDocuments={data?.totaltAntall ?? 0}
            noFiltersActive={noFiltersActive}
            resetFilters={resetFilters}
            filteredDocuments={totalFilteredDocuments}
          />

          <VStack overflowY="auto" flexGrow="1" position="relative" onScroll={onScroll} ref={scrollContainerRef}>
            <Header
              filters={filters}
              allSelectableDocuments={allSelectableDocuments}
              documentIdList={documentsWithVedleggIdList}
              listHeight={listHeight}
              showsAnyVedlegg={showsAnyVedlegg}
              toggleShowAllVedlegg={onToggle}
              searchRef={searchRef}
            />

            <DocumentList
              documents={totalFilteredDocuments}
              isLoading={isLoading}
              onScrollTo={onScrollTo}
              scrollTop={scrollTop}
              listHeight={listHeight}
              showLogiskeVedleggIdList={showLogiskeVedleggIdList}
              setShowLogiskeVedleggIdList={setShowLogiskeVedleggIdList}
            />
          </VStack>
        </KeyboardBoundary>
      </KeyboardContextElement>
    </SelectContextElement>
  );
};

interface KeyboardBoundaryProps {
  children: React.ReactNode;
}

const KeyboardBoundary = ({ children }: KeyboardBoundaryProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { focusSearch } = useKeyboardContext();
  const onKeyDown = useKeyboard();

  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (isMetaKey(e) && e.key === Keys.J) {
        e.preventDefault();
        focusSearch();
      }
    };

    window.addEventListener('keydown', listener);

    return () => {
      window.removeEventListener('keydown', listener);
    };
  }, [focusSearch]);

  return (
    <VStack
      as="section"
      paddingInline="4"
      paddingBlock="0 2"
      flexGrow="1"
      justify="space-between"
      overflow="hidden"
      data-testid="oppgavebehandling-documents-all"
      onKeyDown={onKeyDown}
      tabIndex={0}
      ref={ref}
      onFocus={({ target }) => {
        if (target === ref.current) {
          focusSearch();
        }
      }}
      aria-keyshortcuts={ARIA_KEYSHORTCUTS_STRING}
    >
      {children}
    </VStack>
  );
};

/**
 * `' '` is not a valid key in the ARIA spec, `'Space'` is used instead.
 * @see https://w3c.github.io/aria/#aria-keyshortcuts
 */
const ARIA_KEYSHORTCUTS: (Exclude<Keys, Keys.Space> | 'Space')[][] = [
  [Keys.ArrowUp],
  [Keys.ArrowDown],
  [Keys.Home],
  [Keys.End],
  [Keys.Shift, Keys.Home],
  [Keys.Shift, Keys.End],
  [Keys.Cmd, Keys.ArrowUp],
  [Keys.Cmd, Keys.ArrowDown],
  [Keys.Ctrl, Keys.ArrowUp],
  [Keys.Ctrl, Keys.ArrowDown],
  [Keys.Shift, Keys.ArrowUp],
  [Keys.Shift, Keys.ArrowDown],
  [Keys.Ctrl, Keys.Shift, Keys.ArrowUp],
  [Keys.Ctrl, Keys.Shift, Keys.ArrowDown],
  [Keys.Cmd, Keys.Shift, Keys.ArrowUp],
  [Keys.Cmd, Keys.Shift, Keys.ArrowDown],
  [Keys.ArrowRight],
  [Keys.Cmd, Keys.ArrowRight],
  [Keys.Ctrl, Keys.ArrowRight],
  [Keys.ArrowLeft],
  [Keys.Cmd, Keys.ArrowLeft],
  [Keys.Ctrl, Keys.ArrowLeft],
  [Keys.Cmd, Keys.A],
  [Keys.Cmd, Keys.H],
  [Keys.Cmd, Keys.F],
  [Keys.Cmd, Keys.N],
  [Keys.Cmd, Keys.V],
  [Keys.Cmd, Keys.I],
  [Keys.Cmd, Keys.D],
  ['Space'],
  [Keys.Shift, 'Space'],
  [Keys.Enter],
  [Keys.Cmd, Keys.Enter],
  [Keys.Ctrl, Keys.Enter],
  [Keys.Cmd, Keys.Shift, Keys.D],
  [Keys.Escape],
  [Keys.Cmd, Keys.J],
  [Keys.Ctrl, Keys.J],
];

const ARIA_KEYSHORTCUTS_STRING: string = ARIA_KEYSHORTCUTS.map((keys) => keys.join('+')).join(' ');
