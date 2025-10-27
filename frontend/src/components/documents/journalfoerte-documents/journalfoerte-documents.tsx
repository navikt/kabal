import { DocumentList } from '@app/components/documents/journalfoerte-documents/document-list';
import { Header } from '@app/components/documents/journalfoerte-documents/header/header';
import { JournalfoertHeading } from '@app/components/documents/journalfoerte-documents/heading/heading';
import { KeyboardBoundary } from '@app/components/documents/journalfoerte-documents/keyboard/boundary';
import { KeyboardContextElement } from '@app/components/documents/journalfoerte-documents/keyboard/keyboard-context';
import { SelectContextElement } from '@app/components/documents/journalfoerte-documents/select-context/select-context';
import {
  setShowLogiskeVedlegg,
  useShowLogiskeVedlegg,
} from '@app/components/documents/journalfoerte-documents/state/show-logiske-vedlegg';
import { setShowVedlegg, useShowVedlegg } from '@app/components/documents/journalfoerte-documents/state/show-vedlegg';
import { clamp } from '@app/functions/clamp';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useGetArkiverteDokumenterQuery } from '@app/redux-api/oppgaver/queries/documents';
import type { IArkivertDocument } from '@app/types/arkiverte-documents';
import { VStack } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useFilters } from './header/use-filters';

const EMPTY_ARRAY: IArkivertDocument[] = [];

export const JournalfoerteDocuments = () => {
  const oppgaveId = useOppgaveId();
  const { data, isLoading } = useGetArkiverteDokumenterQuery(oppgaveId ?? skipToken);
  const [listHeight, setListHeight] = useState<number>(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const keyboardBoundaryRef = useRef<HTMLDivElement>(null);

  const documents = data?.dokumenter ?? EMPTY_ARRAY;

  const filters = useFilters(documents);
  const { resetFilters, noFiltersActive, totalFilteredDocuments } = filters;

  const documentsWithVedleggIdList = useMemo<string[]>(() => {
    const journalpostIdList: string[] = [];

    for (const d of documents) {
      if (d.hasAccess && (d.vedlegg.length > 0 || d.logiskeVedlegg.length > 0)) {
        journalpostIdList.push(d.journalpostId);
      }
    }

    return journalpostIdList;
  }, [documents]);

  const showVedleggIdList = useShowVedlegg();

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

  const showLogiskeVedleggIdList = useShowLogiskeVedlegg();

  useEffect(() => {
    if (documentsWithVedleggIdList.length !== 0) {
      setShowVedlegg((e) => (e.length !== 0 ? e : documentsWithVedleggIdList));
    }
  }, [documentsWithVedleggIdList]);

  useEffect(() => {
    if (vedleggWithLogiskeVedleggIdList.length !== 0) {
      setShowLogiskeVedlegg((e) => (e.length !== 0 ? e : vedleggWithLogiskeVedleggIdList));
    }
  }, [vedleggWithLogiskeVedleggIdList]);

  const showsAnyVedlegg = showVedleggIdList.length > 0 || showLogiskeVedleggIdList.length > 0;

  const onToggle = useCallback(() => {
    setShowVedlegg(showsAnyVedlegg ? [] : documentsWithVedleggIdList);
    setShowLogiskeVedlegg(showsAnyVedlegg ? [] : vedleggWithLogiskeVedleggIdList);
  }, [documentsWithVedleggIdList, showsAnyVedlegg, vedleggWithLogiskeVedleggIdList]);

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

  const onScrollTo = useCallback((top: number) => {
    if (scrollContainerRef.current === null) {
      return;
    }

    if (top < scrollContainerRef.current.scrollTop) {
      scrollContainerRef.current.scrollTo({ top });
      return;
    }

    const bottom = top + 32;

    if (bottom > scrollContainerRef.current.scrollTop + scrollContainerRef.current.clientHeight) {
      scrollContainerRef.current.scrollTo({ top: bottom - scrollContainerRef.current.clientHeight });
      return;
    }
  }, []);

  const searchRef = useRef<HTMLInputElement>(null);

  return (
    <SelectContextElement allDocumentsList={documents} filteredDocumentsList={totalFilteredDocuments}>
      <VStack
        as="section"
        aria-labelledby="journalfoerte-dokumenter-heading"
        paddingInline="4"
        paddingBlock="0 2"
        flexGrow="1"
        justify="space-between"
        overflow="hidden"
        data-testid="oppgavebehandling-documents-all"
      >
        <JournalfoertHeading
          allDocuments={documents}
          totalLengthOfMainDocuments={data?.totaltAntall ?? 0}
          noFiltersActive={noFiltersActive}
          resetFilters={resetFilters}
          filteredDocuments={totalFilteredDocuments}
        />

        <Header
          filters={filters}
          documentIdList={documentsWithVedleggIdList}
          listHeight={listHeight}
          showsAnyVedlegg={showsAnyVedlegg}
          toggleShowAllVedlegg={onToggle}
          searchRef={searchRef}
          keyboardBoundaryRef={keyboardBoundaryRef}
        />

        <VStack
          overflowY="scroll"
          overflowX="hidden"
          flexGrow="1"
          position="relative"
          onScroll={onScroll}
          ref={scrollContainerRef}
        >
          <KeyboardContextElement filteredDocuments={totalFilteredDocuments} searchRef={searchRef}>
            <KeyboardBoundary ref={keyboardBoundaryRef}>
              <DocumentList
                documents={totalFilteredDocuments}
                isLoading={isLoading}
                onScrollTo={onScrollTo}
                scrollTop={scrollTop}
                listHeight={listHeight}
              />
            </KeyboardBoundary>
          </KeyboardContextElement>
        </VStack>
      </VStack>
    </SelectContextElement>
  );
};
