import { ChevronDownDoubleIcon, ChevronDownIcon, ChevronUpDoubleIcon, ChevronUpIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import React, { useCallback, useContext, useMemo, useRef } from 'react';
import { styled } from 'styled-components';
import { createDragUI } from '@app/components/documents/create-drag-ui';
import { DragAndDropContext } from '@app/components/documents/drag-context';
import { ExpandedColumns } from '@app/components/documents/journalfoerte-documents/document/expanded-columns';
import { SelectRow } from '@app/components/documents/journalfoerte-documents/document/shared/select-row';
import { StyledJournalfoertDocument } from '@app/components/documents/journalfoerte-documents/document/styled-journalfoert-document';
import { Fields } from '@app/components/documents/journalfoerte-documents/grid';
import { SelectContext } from '@app/components/documents/journalfoerte-documents/select-context/select-context';
import { useArchivedDocumentsColumns } from '@app/hooks/settings/use-archived-documents-setting';
import { useHasDocumentsAccess } from '@app/hooks/use-has-documents-access';
import { useIsRol } from '@app/hooks/use-is-rol';
import { useIsSaksbehandler } from '@app/hooks/use-is-saksbehandler';
import { IArkivertDocument } from '@app/types/arkiverte-documents';
import { DocumentTitle } from './shared/document-title';
import { IncludeDocument } from './shared/include-document';

interface Props {
  document: IArkivertDocument;
  isSelected: boolean;
  isExpandedListView: boolean;
  showMetadata: boolean;
  toggleShowMetadata: () => void;
  showVedlegg: boolean;
  toggleShowVedlegg: () => void;
  hasVedlegg: boolean;
}

export const Document = ({
  document,
  isSelected,
  isExpandedListView,
  showMetadata,
  toggleShowMetadata,
  showVedlegg,
  toggleShowVedlegg,
  hasVedlegg,
}: Props) => {
  const isSaksbehandler = useIsSaksbehandler();
  const isRol = useIsRol();
  const hasDocumentsAccess = useHasDocumentsAccess();
  const { columns } = useArchivedDocumentsColumns();

  const { getSelectedDocuments } = useContext(SelectContext);
  const { setDraggedJournalfoertDocuments, clearDragState, draggingEnabled } = useContext(DragAndDropContext);

  const cleanDragUI = useRef<() => void>(() => undefined);

  const { dokumentInfoId, journalpostId, tittel, harTilgangTilArkivvariant, valgt } = document;

  const Icon = useMemo(() => {
    if (hasVedlegg) {
      return showVedlegg ? ChevronUpDoubleIcon : ChevronDownDoubleIcon;
    }

    return showVedlegg ? ChevronUpIcon : ChevronDownIcon;
  }, [hasVedlegg, showVedlegg]);

  const onDragStart = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.dataTransfer.clearData();

      const docs = isSelected ? getSelectedDocuments() : [document];

      if (docs.length === 0) {
        return;
      }

      cleanDragUI.current = createDragUI(
        docs.map((d) => d.tittel ?? ''),
        e,
      );

      e.dataTransfer.effectAllowed = 'link';
      e.dataTransfer.dropEffect = 'link';
      setDraggedJournalfoertDocuments(docs);
    },
    [document, getSelectedDocuments, isSelected, setDraggedJournalfoertDocuments],
  );

  const disabled = (!isSaksbehandler && !isRol) || !harTilgangTilArkivvariant;
  const draggingIsEnabled = draggingEnabled && harTilgangTilArkivvariant && (isRol || hasDocumentsAccess);

  return (
    <StyledJournalfoertDocument
      $isExpanded={isExpandedListView}
      $selected={isSelected}
      $columns={columns}
      data-testid="document-journalfoert"
      data-journalpostid={journalpostId}
      data-dokumentinfoid={dokumentInfoId}
      data-documentname={tittel}
      onDragStart={draggingIsEnabled ? onDragStart : (e) => e.preventDefault()}
      onDragEnd={() => {
        cleanDragUI.current();
        clearDragState();
      }}
      draggable={draggingIsEnabled}
    >
      <SelectRow
        journalpostId={journalpostId}
        dokumentInfoId={dokumentInfoId}
        harTilgangTilArkivvariant={harTilgangTilArkivvariant}
      />

      <ExpandButton
        variant="tertiary"
        size="small"
        icon={<Icon aria-hidden />}
        onClick={toggleShowVedlegg}
        aria-label={showVedlegg ? 'Skjul vedlegg' : 'Vis vedlegg'}
      />

      <DocumentTitle
        journalpostId={journalpostId}
        dokumentInfoId={dokumentInfoId}
        harTilgangTilArkivvariant={harTilgangTilArkivvariant}
        tittel={tittel ?? ''}
      />

      {isExpandedListView ? (
        <ExpandedColumns document={document} showMetadata={showMetadata} toggleShowMetadata={toggleShowMetadata} />
      ) : null}

      <IncludeDocument
        dokumentInfoId={dokumentInfoId}
        journalpostId={journalpostId}
        disabled={disabled}
        name={tittel ?? ''}
        checked={valgt}
      />
    </StyledJournalfoertDocument>
  );
};

Document.displayName = 'Document';

const ExpandButton = styled(Button)`
  grid-area: ${Fields.ToggleVedlegg};
`;
