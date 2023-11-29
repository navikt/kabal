import { Loader } from '@navikt/ds-react';
import React, { memo, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { EXPANDED_HEIGHT, ROW_HEIGHT } from '@app/components/documents/journalfoerte-documents/contants';
import { AttachmentListItem } from '@app/components/documents/journalfoerte-documents/document/attachments/attachment-list';
import { ExpandedDocument } from '@app/components/documents/journalfoerte-documents/document/expanded-document';
import { DocumentContext } from '@app/components/documents/journalfoerte-documents/document-context';
import { SelectContext } from '@app/components/documents/journalfoerte-documents/select-context/select-context';
import { JournalfoerteDocumentsAttachments } from '@app/components/documents/styled-components/attachment-list';
import { useIsExpanded } from '@app/components/documents/use-is-expanded';
import { clamp } from '@app/functions/clamp';
import { IArkivertDocument } from '@app/types/arkiverte-documents';
import { StyledDocumentList } from '../styled-components/document-list';
import { Document } from './document/document';
import { StyledDocumentListItem } from './document-list-item';

interface Props {
  documents: IArkivertDocument[];
  isLoading: boolean;
}

const OVERSCAN_ROWS = 1;

export const DocumentList = memo(
  ({ documents, isLoading }: Props) => {
    const { isSelected } = useContext(SelectContext);
    const [isExpanded] = useIsExpanded();
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [containerHeight, setContainerHeight] = useState(0);
    const [expandedIds, setExpandedIds] = useState<string[]>([]);
    const [_scrollTop, _setScrollTop] = useState(0);
    const [scrollTop, setScrollTop] = useState(0);

    useEffect(() => {
      const handle = requestAnimationFrame(() => setScrollTop(_scrollTop));

      return () => cancelAnimationFrame(handle);
    }, [_scrollTop]);

    useEffect(() => {
      const resizeObserver = new ResizeObserver(() => setContainerHeight(containerRef.current?.clientHeight ?? 0));

      if (containerRef.current !== null) {
        resizeObserver.observe(containerRef.current);

        return () => resizeObserver.disconnect();
      }
    }, []);

    const [listHeight, items] = useMemo<[number, React.ReactNode[]]>(() => {
      let _height = 0;
      let documentIndex = 0;
      const _items: React.ReactNode[] = [];
      const overscanHeight = ROW_HEIGHT * OVERSCAN_ROWS;
      const start = scrollTop - overscanHeight; // Add row(s) below the viewport to ensure that the user can navigate by keyboard.
      const end = scrollTop + containerHeight + overscanHeight; // Add row(s) above the viewport to ensure that the user can navigate by keyboard.

      for (const doc of documents) {
        const expanded = expandedIds.includes(doc.journalpostId);
        const expandedHeight = expanded ? EXPANDED_HEIGHT : 0;
        const documentHeight = ROW_HEIGHT + expandedHeight;
        const vedleggLength = doc.vedlegg.length;
        const attachmentHeight = vedleggLength * ROW_HEIGHT;
        const relativeScrollTop = scrollTop - _height - documentHeight;
        const vedleggEndIndex = clamp(
          Math.ceil((relativeScrollTop + containerHeight) / ROW_HEIGHT) + OVERSCAN_ROWS, // Add row(s) below the viewport to ensure that the user can navigate by keyboard.
          0,
          vedleggLength,
        );
        const vedleggStartIndex = clamp(
          Math.floor(relativeScrollTop / ROW_HEIGHT) - OVERSCAN_ROWS, // Add row(s) above the viewport to ensure that the user can navigate by keyboard.
          0,
          vedleggEndIndex,
        );

        const vedleggSlice = doc.vedlegg.slice(vedleggStartIndex, vedleggEndIndex);
        const renderedVedleggLength = vedleggEndIndex - vedleggStartIndex;
        const hasRenderedVedlegg = renderedVedleggLength !== 0;
        const vedleggNodeList = new Array<React.ReactNode>(renderedVedleggLength);

        if (hasRenderedVedlegg) {
          for (let i = renderedVedleggLength - 1; i >= 0; i--) {
            const vedlegg = vedleggSlice[i]!;
            const index = vedleggStartIndex + i;

            vedleggNodeList[i] = (
              <AttachmentListItem
                key={`vedlegg_${doc.journalpostId}_${vedlegg.dokumentInfoId}`}
                journalpostId={doc.journalpostId}
                vedlegg={vedlegg}
                isSelected={isSelected({ journalpostId: doc.journalpostId, dokumentInfoId: vedlegg.dokumentInfoId })}
                style={{ top: index * ROW_HEIGHT }}
                aria-rowindex={index}
              />
            );
          }
        }

        const renderDocument = relativeScrollTop < overscanHeight;
        const journalpostHeight = documentHeight + attachmentHeight;

        if (hasRenderedVedlegg || (_height + documentHeight >= start && _height <= end)) {
          _items.push(
            <StyledDocumentListItem
              data-testid="oppgavebehandling-documents-all-list-item"
              data-documentname={doc.tittel}
              key={`dokument_${doc.journalpostId}_${doc.dokumentInfoId}`}
              style={{ top: _height, height: journalpostHeight }}
              aria-rowindex={documentIndex}
            >
              {renderDocument ? <Document document={doc} isSelected={isSelected(doc)} isExpanded={isExpanded} /> : null}
              {renderDocument && expanded && isExpanded ? <ExpandedDocument document={doc} /> : null}
              {!hasRenderedVedlegg ? null : (
                <JournalfoerteDocumentsAttachments
                  data-testid="oppgavebehandling-documents-all-vedlegg-list"
                  aria-rowcount={vedleggLength}
                  style={{ height: attachmentHeight, top: documentHeight }}
                >
                  {vedleggNodeList}
                </JournalfoerteDocumentsAttachments>
              )}
            </StyledDocumentListItem>,
          );
        }

        _height += journalpostHeight;
        documentIndex++;
      }

      return [_height, _items];
    }, [containerHeight, documents, expandedIds, isExpanded, isSelected, scrollTop]);

    const onScroll: React.UIEventHandler<HTMLDivElement> = useCallback(({ currentTarget }) => {
      const clamped = clamp(currentTarget.scrollTop, 0, currentTarget.scrollHeight - currentTarget.clientHeight); // Elastic scrolling in Safari can exceed the boundries.
      _setScrollTop(clamped);
    }, []);

    const onRef = useCallback((ref: HTMLDivElement | null) => {
      setContainerHeight(ref?.clientHeight ?? 0);
      containerRef.current = ref;
    }, []);

    return (
      <div ref={onRef} style={{ overflow: 'auto', position: 'relative' }} onScroll={onScroll}>
        <DocumentContext.Provider value={{ expandedIds, setExpandedIds }}>
          <StyledDocumentList
            data-testid="oppgavebehandling-documents-all-list"
            aria-rowcount={documents.length}
            style={{ height: listHeight, overflowY: 'hidden' }}
          >
            <DocumentsSpinner hasDocuments={!isLoading} />
            {items}
          </StyledDocumentList>
        </DocumentContext.Provider>
      </div>
    );
  },
  (prevProps, nextProps) => prevProps.documents === nextProps.documents,
);

DocumentList.displayName = 'DocumentList';

interface DocumentsSpinnerProps {
  hasDocuments: boolean;
}

const DocumentsSpinner = ({ hasDocuments }: DocumentsSpinnerProps): JSX.Element | null =>
  hasDocuments ? null : <Loader size="xlarge" />;
