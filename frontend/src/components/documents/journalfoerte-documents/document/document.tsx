import { createDragUI } from '@app/components/documents/create-drag-ui';
import { DragAndDropContext } from '@app/components/documents/drag-context';
import { ExpandedColumns } from '@app/components/documents/journalfoerte-documents/document/expanded-columns';
import { SelectRow } from '@app/components/documents/journalfoerte-documents/document/shared/select-row';
import { StyledJournalfoertDocument } from '@app/components/documents/journalfoerte-documents/document/styled-journalfoert-document';
import { Fields } from '@app/components/documents/journalfoerte-documents/grid';
import { setRealDocumentPath } from '@app/components/documents/journalfoerte-documents/keyboard/state/focus';
import { SelectContext } from '@app/components/documents/journalfoerte-documents/select-context/select-context';
import { useArchivedDocumentsColumns } from '@app/hooks/settings/use-archived-documents-setting';
import { useHasDocumentsAccess } from '@app/hooks/use-has-documents-access';
import { useIsRol } from '@app/hooks/use-is-rol';
import type { IArkivertDocument } from '@app/types/arkiverte-documents';
import { ChevronDownDoubleIcon, ChevronDownIcon, ChevronUpDoubleIcon, ChevronUpIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import { useCallback, useContext, useMemo, useRef } from 'react';
import { DocumentTitle } from './shared/document-title';
import { IncludeDocument } from './shared/include-document';

interface Props {
  document: IArkivertDocument;
  index: number;
  isSelected: boolean;
  isExpandedListView: boolean;
  showMetadata: boolean;
  toggleShowMetadata: () => void;
  showVedlegg: boolean;
  toggleShowVedlegg: () => void;
  hasVedlegg: boolean;
  className?: string;
}

export const Document = ({
  document,
  index,
  isSelected,
  isExpandedListView,
  showMetadata,
  toggleShowMetadata,
  showVedlegg,
  toggleShowVedlegg,
  hasVedlegg,
  className,
}: Props) => {
  const isRol = useIsRol();
  const hasDocumentsAccess = useHasDocumentsAccess();
  const { columns } = useArchivedDocumentsColumns();

  const { getSelectedDocuments } = useContext(SelectContext);
  const { setDraggedJournalfoertDocuments, clearDragState, draggingEnabled } = useContext(DragAndDropContext);

  const cleanDragUI = useRef<() => void>(() => undefined);

  const { dokumentInfoId, journalpostId, tittel, hasAccess, valgt, journalstatus } = document;

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

  const ref = useRef<HTMLDivElement>(null);

  const draggingIsEnabled = draggingEnabled && hasAccess && (isRol || hasDocumentsAccess);

  return (
    <StyledJournalfoertDocument
      ref={ref}
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
      className={className}
      onClick={hasAccess ? () => setRealDocumentPath(index, -1) : undefined}
    >
      <SelectRow journalpostId={journalpostId} dokumentInfoId={dokumentInfoId} hasAccess={hasAccess} />

      <Button
        variant="tertiary"
        size="small"
        icon={<Icon aria-hidden />}
        onClick={toggleShowVedlegg}
        aria-label={showVedlegg ? 'Skjul vedlegg' : 'Vis vedlegg'}
        style={{ gridArea: Fields.ToggleVedlegg }}
        tabIndex={-1}
      />

      <DocumentTitle
        journalpostId={journalpostId}
        dokumentInfoId={dokumentInfoId}
        hasAccess={hasAccess}
        tittel={tittel ?? ''}
      />

      {isExpandedListView ? (
        <ExpandedColumns document={document} showMetadata={showMetadata} toggleShowMetadata={toggleShowMetadata} />
      ) : null}

      <IncludeDocument
        dokumentInfoId={dokumentInfoId}
        journalpostId={journalpostId}
        journalpoststatus={journalstatus}
        hasAccess={hasAccess}
        name={tittel ?? ''}
        checked={valgt}
      />
    </StyledJournalfoertDocument>
  );
};

Document.displayName = 'Document';
