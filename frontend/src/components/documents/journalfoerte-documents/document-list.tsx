import {
  type DokumentRenderData,
  type VedleggRenderData,
  calculateDokumentPositions,
} from '@app/components/documents/journalfoerte-documents/calculate';
import { ExpandedDocument } from '@app/components/documents/journalfoerte-documents/document/expanded-document';
import { KeyboardFocusIndicator } from '@app/components/documents/journalfoerte-documents/keyboard/keyboard-focus-indicator';
import { LogiskeVedleggList } from '@app/components/documents/journalfoerte-documents/logiske-vedlegg-list';
import { SelectContext } from '@app/components/documents/journalfoerte-documents/select-context/select-context';
import { useShowMetadata } from '@app/components/documents/journalfoerte-documents/state/show-metadata';
import { useShowVedlegg } from '@app/components/documents/journalfoerte-documents/state/show-vedlegg';
import { VedleggList } from '@app/components/documents/journalfoerte-documents/vedlegg-list';
import { useIsExpanded } from '@app/components/documents/use-is-expanded';
import type { IArkivertDocument } from '@app/types/arkiverte-documents';
import { Box, Loader } from '@navikt/ds-react';
import { useContext, useMemo } from 'react';
import { StyledDocumentList } from '../styled-components/document-list';
import { Document } from './document/document';

interface Props {
  documents: IArkivertDocument[];
  isLoading: boolean;
  scrollTop: number;
  listHeight: number;
  onScrollTo: (top: DokumentRenderData | VedleggRenderData) => void;
  showLogiskeVedleggIdList: string[];
  setShowLogiskeVedleggIdList: (ids: string[] | ((ids: string[]) => string[])) => void;
}

const OVERSCAN = 32;

export const DocumentList = ({
  documents,
  isLoading,
  scrollTop,
  listHeight,
  onScrollTo,
  showLogiskeVedleggIdList,
  setShowLogiskeVedleggIdList,
}: Props) => {
  const { isSelected } = useContext(SelectContext);
  const [isExpandedListView] = useIsExpanded();
  const { showVedleggIdList, setShowVedleggIdList } = useShowVedlegg();
  const { showMetadataIdList, setShowMetadataIdList } = useShowMetadata();

  const dokumenter = useMemo(
    () => calculateDokumentPositions(documents, showMetadataIdList, showVedleggIdList, showLogiskeVedleggIdList),
    [documents, showLogiskeVedleggIdList, showMetadataIdList, showVedleggIdList],
  );

  if (isLoading) {
    return (
      <Box data-test position="relative" paddingBlock="2">
        <StyledDocumentList data-testid="oppgavebehandling-documents-all-list">
          <Loader size="xlarge" aria-hidden role="presentation" />
        </StyledDocumentList>
      </Box>
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

    const selected = isSelected(dokument);

    list.push(
      <Box
        as="li"
        data-testid="oppgavebehandling-documents-all-list-item"
        data-documentname={tittel}
        aria-setsize={documents.length}
        aria-posinset={index + 1}
        aria-level={1}
        aria-label={tittel ?? 'Dokument uten navn'}
        aria-selected={selected}
        aria-expanded={showVedlegg}
        role="treeitem"
        key={`dokument_${journalpostId}_${dokumentInfoId}`}
        style={{ top: globalTop, height }}
        position="absolute"
        right="0"
        left="0"
        paddingInline="05"
        borderRadius="medium"
      >
        <Document
          document={dokument}
          index={index}
          isSelected={selected}
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
      </Box>,
    );
  }

  return (
    <Box position="relative" paddingBlock="2" marginBlock="0 8">
      <StyledDocumentList
        data-testid="oppgavebehandling-documents-all-list"
        style={{ height: dokumenter.height }}
        flexShrink="0"
        flexGrow="1"
        role="tree"
        aria-multiselectable
        aria-labelledby="journalfoerte-dokumenter-heading"
      >
        {list}
      </StyledDocumentList>

      <KeyboardFocusIndicator dokumenterList={dokumenter.list} onScrollTo={onScrollTo} />
    </Box>
  );
};
