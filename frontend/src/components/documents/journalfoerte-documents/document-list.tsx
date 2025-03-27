import { calculateDokumentPositions } from '@app/components/documents/journalfoerte-documents/calculate';
import { ExpandedDocument } from '@app/components/documents/journalfoerte-documents/document/expanded-document';
import { useKeyboardContext } from '@app/components/documents/journalfoerte-documents/keyboard-context';
import { LogiskeVedleggList } from '@app/components/documents/journalfoerte-documents/logiske-vedlegg-list';
import { SelectContext } from '@app/components/documents/journalfoerte-documents/select-context/select-context';
import { VedleggList } from '@app/components/documents/journalfoerte-documents/vedlegg-list';
import { useIsExpanded } from '@app/components/documents/use-is-expanded';
import type { IArkivertDocument } from '@app/types/arkiverte-documents';
import { Loader } from '@navikt/ds-react';
import { useCallback, useContext, useEffect, useMemo, useRef } from 'react';
import { StyledDocumentList } from '../styled-components/document-list';
import { Document } from './document/document';

interface Props {
  documents: IArkivertDocument[];
  isLoading: boolean;
  scrollTop: number;
  listHeight: number;
  onHeightChange: (height: number) => void;
  showVedleggIdList: string[];
  setShowVedleggIdList: (ids: string[] | ((ids: string[]) => string[])) => void;
  showLogiskeVedleggIdList: string[];
  setShowLogiskeVedleggIdList: (ids: string[] | ((ids: string[]) => string[])) => void;
  showMetadataIdList: string[];
  setShowMetadataIdList: (ids: string[] | ((ids: string[]) => string[])) => void;
}

const OVERSCAN = 320;

export const DocumentList = ({
  documents,
  isLoading,
  scrollTop,
  listHeight,
  onHeightChange,
  showVedleggIdList,
  setShowVedleggIdList,
  showLogiskeVedleggIdList,
  setShowLogiskeVedleggIdList,
  showMetadataIdList,
  setShowMetadataIdList,
}: Props) => {
  const { isSelected } = useContext(SelectContext);
  const [isExpandedListView] = useIsExpanded();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { activeDocument, activeVedlegg } = useKeyboardContext();

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      const h = containerRef.current?.clientHeight ?? 0;
      onHeightChange(h);
    });

    if (containerRef.current !== null) {
      resizeObserver.observe(containerRef.current);

      return () => resizeObserver.disconnect();
    }
  }, [onHeightChange]);

  const onRef = useCallback(
    (ref: HTMLDivElement | null) => {
      const h = ref?.clientHeight ?? 0;
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
      <div className="relative min-h-full grow overflow-auto" ref={onRef}>
        <StyledDocumentList data-testid="oppgavebehandling-documents-all-list" aria-rowcount={documents.length}>
          <Loader size="xlarge" />
        </StyledDocumentList>
      </div>
    );
  }

  const list: React.ReactNode[] = [];
  const maxTop = scrollTop + listHeight + OVERSCAN;
  const minTop = scrollTop - OVERSCAN;

  for (const dok of dokumenter.list) {
    const { index, dokument, globalTop, height, showMetadata, showVedlegg, logiskeVedleggList, vedleggList } = dok;

    if (globalTop + height < minTop || globalTop > maxTop) {
      continue;
    }

    const { journalpostId, dokumentInfoId, tittel, vedlegg, logiskeVedlegg, tema } = dokument;
    const hasVedlegg = vedlegg.length > 0;

    list.push(
      <li
        data-testid="oppgavebehandling-documents-all-list-item"
        data-documentname={tittel}
        key={`dokument_${journalpostId}_${dokumentInfoId}`}
        style={{ top: globalTop, height }}
        className="absolute right-0 left-0 mx-(--a-spacing-05) rounded-(--a-border-radius-medium)"
      >
        <Document
          className={index === activeDocument && activeVedlegg === -1 ? 'outline-2' : ''}
          isKeyboardFocused={index === activeDocument && activeVedlegg === -1}
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
            dokumentIndex={index}
            isSelected={isSelected}
            showLogiskeVedleggIdList={showLogiskeVedleggIdList}
            setShowLogiskeVedleggIdList={setShowLogiskeVedleggIdList}
          />
        ) : null}
      </li>,
    );
  }

  return (
    <div className="relative min-h-full grow" ref={onRef}>
      <StyledDocumentList
        data-testid="oppgavebehandling-documents-all-list"
        aria-rowcount={documents.length}
        style={{ height: dokumenter.height }}
      >
        {list}
      </StyledDocumentList>
    </div>
  );
};
