import { calculateDokumentPositions } from '@app/components/documents/journalfoerte-documents/calculate';
import { ExpandedDocument } from '@app/components/documents/journalfoerte-documents/document/expanded-document';
import { LogiskeVedleggList } from '@app/components/documents/journalfoerte-documents/logiske-vedlegg-list';
import { SelectContext } from '@app/components/documents/journalfoerte-documents/select-context/select-context';
import { VedleggList } from '@app/components/documents/journalfoerte-documents/vedlegg-list';
import { useIsExpanded } from '@app/components/documents/use-is-expanded';
import { clamp } from '@app/functions/clamp';
import type { IArkivertDocument } from '@app/types/arkiverte-documents';
import { Loader } from '@navikt/ds-react';
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Container, StyledDocumentList } from '../styled-components/document-list';
import { StyledDocumentListItem } from './document-list-item';
import { Document } from './document/document';

interface Props {
  documents: IArkivertDocument[];
  isLoading: boolean;
  onHeightChange: (height: number) => void;
  showVedleggIdList: string[];
  setShowVedleggIdList: (ids: string[] | ((ids: string[]) => string[])) => void;
  showLogiskeVedleggIdList: string[];
  setShowLogiskeVedleggIdList: (ids: string[] | ((ids: string[]) => string[])) => void;
}

const OVERSCAN = 32;

export const DocumentList = ({
  documents,
  isLoading,
  onHeightChange,
  showVedleggIdList,
  setShowVedleggIdList,
  showLogiskeVedleggIdList,
  setShowLogiskeVedleggIdList,
}: Props) => {
  const { isSelected } = useContext(SelectContext);
  const [isExpandedListView] = useIsExpanded();
  const [showMetadataIdList, setShowMetadataIdList] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerHeight, setContainerHeight] = useState(0);
  const [_scrollTop, _setScrollTop] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);

  useEffect(() => {
    const handle = requestAnimationFrame(() => setScrollTop(_scrollTop));

    return () => cancelAnimationFrame(handle);
  }, [_scrollTop]);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      const h = containerRef.current?.clientHeight ?? 0;
      setContainerHeight(h);
      onHeightChange(h);
    });

    if (containerRef.current !== null) {
      resizeObserver.observe(containerRef.current);

      return () => resizeObserver.disconnect();
    }
  }, [onHeightChange]);

  const onScroll: React.UIEventHandler<HTMLDivElement> = useCallback(({ currentTarget }) => {
    const clamped = clamp(currentTarget.scrollTop, 0, currentTarget.scrollHeight - currentTarget.clientHeight); // Elastic scrolling in Safari can exceed the boundries.
    _setScrollTop(clamped);
  }, []);

  const onRef = useCallback(
    (ref: HTMLDivElement | null) => {
      const h = ref?.clientHeight ?? 0;
      setContainerHeight(h);
      onHeightChange(h);
      containerRef.current = ref;
    },
    [onHeightChange],
  );

  const dokumenter = useMemo(
    () => calculateDokumentPositions(documents, showMetadataIdList, showVedleggIdList, showLogiskeVedleggIdList),
    [documents, showLogiskeVedleggIdList, showMetadataIdList, showVedleggIdList],
  );

  if (isLoading) {
    return (
      <Container ref={onRef} className="h-full" onScroll={onScroll}>
        <StyledDocumentList data-testid="oppgavebehandling-documents-all-list" aria-rowcount={documents.length}>
          <Loader size="xlarge" />
        </StyledDocumentList>
      </Container>
    );
  }

  const list: React.ReactNode[] = [];
  const maxTop = scrollTop + containerHeight + OVERSCAN;
  const minTop = scrollTop - OVERSCAN;

  for (const {
    dokument,
    globalTop,
    height,
    showMetadata,
    showVedlegg,
    logiskeVedleggList,
    vedleggList,
    index,
  } of dokumenter.list) {
    if (globalTop + height < minTop || globalTop > maxTop) {
      continue;
    }

    const { journalpostId, dokumentInfoId, tittel, vedlegg, logiskeVedlegg, tema } = dokument;
    const hasVedlegg = vedlegg.length > 0;

    list.push(
      <StyledDocumentListItem
        data-testid="oppgavebehandling-documents-all-list-item"
        data-documentname={tittel}
        key={`dokument_${journalpostId}_${dokumentInfoId}`}
        style={{ top: globalTop, height }}
        aria-rowindex={index}
      >
        <Document
          document={dokument}
          isSelected={isSelected(dokument)}
          isExpandedListView={isExpandedListView}
          showMetadata={showMetadata}
          toggleShowMetadata={() =>
            setShowMetadataIdList((ids) =>
              showMetadata ? ids.filter((id) => id !== journalpostId) : [...ids, journalpostId],
            )
          }
          showVedlegg={showVedlegg}
          hasVedlegg={hasVedlegg || logiskeVedlegg.length > 0}
          toggleShowVedlegg={() => {
            setShowVedleggIdList((ids) =>
              showVedlegg ? ids.filter((id) => id !== journalpostId) : [...ids, journalpostId],
            );

            const vedleggWithLogiskeVedlegg = dokument.vedlegg.filter((v) => v.logiskeVedlegg.length > 0);

            if (vedleggWithLogiskeVedlegg.length === 0) {
              return;
            }

            const vedleggIds = vedleggWithLogiskeVedlegg.map((v) => `${journalpostId}-${v.dokumentInfoId}`);

            setShowLogiskeVedleggIdList((ids) =>
              showVedlegg ? ids.filter((id) => !vedleggIds.includes(id)) : [...ids, ...vedleggIds],
            );
          }}
        />

        {isExpandedListView && showMetadata ? <ExpandedDocument document={dokument} /> : null}

        {showVedlegg ? (
          <LogiskeVedleggList
            list={logiskeVedleggList}
            minTop={minTop}
            maxTop={maxTop}
            left={16}
            connectTop={8}
            hasVedlegg={hasVedlegg}
            dokumentInfoId={dokumentInfoId}
            logiskeVedlegg={logiskeVedlegg}
            temaId={tema}
          />
        ) : null}
        {showVedlegg ? (
          <VedleggList
            list={vedleggList}
            minTop={minTop}
            maxTop={maxTop}
            dokument={dokument}
            isSelected={isSelected}
            showLogiskeVedleggIdList={showLogiskeVedleggIdList}
            setShowLogiskeVedleggIdList={setShowLogiskeVedleggIdList}
          />
        ) : null}
      </StyledDocumentListItem>,
    );
  }

  return (
    <Container ref={onRef} onScroll={onScroll}>
      <StyledDocumentList
        data-testid="oppgavebehandling-documents-all-list"
        aria-rowcount={documents.length}
        style={{ height: dokumenter.height }}
      >
        {list}
      </StyledDocumentList>
    </Container>
  );
};
