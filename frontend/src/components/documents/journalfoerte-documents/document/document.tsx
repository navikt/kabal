import { createDragUI } from '@app/components/documents/create-drag-ui';
import { DragAndDropContext } from '@app/components/documents/drag-context';
import { ExpandedColumns } from '@app/components/documents/journalfoerte-documents/document/expanded-columns';
import { ToggleVedleggButton } from '@app/components/documents/journalfoerte-documents/document/shared/toggle-vedlegg';
import { StyledJournalfoertDocument } from '@app/components/documents/journalfoerte-documents/document/styled-journalfoert-document';
import { Fields } from '@app/components/documents/journalfoerte-documents/grid';
import { convertRealToAccessibleDocumentIndex } from '@app/components/documents/journalfoerte-documents/keyboard/helpers/index-converters';
import { setFocusIndex } from '@app/components/documents/journalfoerte-documents/keyboard/state/focus';
import {
  addOne,
  isSelected,
  selectRangeTo,
  unselectOne,
  useIsPathSelected,
} from '@app/components/documents/journalfoerte-documents/keyboard/state/selection';
import { SelectContext } from '@app/components/documents/journalfoerte-documents/select-context/select-context';
import { useArchivedDocumentsColumns } from '@app/hooks/settings/use-archived-documents-setting';
import { useHasDocumentsAccess } from '@app/hooks/use-has-documents-access';
import { useIsRol } from '@app/hooks/use-is-rol';
import type { IArkivertDocument } from '@app/types/arkiverte-documents';
import { Checkbox } from '@navikt/ds-react';
import { useCallback, useContext, useRef } from 'react';
import { DocumentTitle } from './shared/document-title';
import { IncludeDocument } from './shared/include-document';

interface Props {
  document: IArkivertDocument;
  index: number;
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

  const selected = useIsPathSelected(index);

  const onDragStart = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.dataTransfer.clearData();

      const docs = selected ? getSelectedDocuments() : [document];

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
    [document, getSelectedDocuments, selected, setDraggedJournalfoertDocuments],
  );

  const ref = useRef<HTMLDivElement>(null);

  const draggingIsEnabled = draggingEnabled && hasAccess && (isRol || hasDocumentsAccess);

  const onDoubleClick = useCallback(() => {
    const accessibleIndex = convertRealToAccessibleDocumentIndex([index, -1]);

    if (accessibleIndex === undefined) {
      return;
    }

    setFocusIndex(accessibleIndex);
    selected ? unselectOne(accessibleIndex) : addOne(accessibleIndex);
  }, [selected, index]);

  const onSelectPath = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();

      const accessibleIndex = convertRealToAccessibleDocumentIndex([index, -1]);

      if (accessibleIndex === undefined) {
        return;
      }

      if (isSelected(accessibleIndex)) {
        return unselectOne(accessibleIndex);
      }

      if (e.shiftKey) {
        return selectRangeTo(accessibleIndex);
      }

      return addOne(accessibleIndex);
    },
    [index],
  );

  return (
    <StyledJournalfoertDocument
      ref={ref}
      $isExpanded={isExpandedListView}
      $selected={selected}
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
      className={`px-1.5 hover:bg-surface-hover focus:outline-none ${className}`}
      onDoubleClick={hasAccess ? onDoubleClick : undefined}
      tabIndex={-1}
    >
      <Checkbox
        size="small"
        checked={selected}
        style={{ gridArea: Fields.Select }}
        hideLabel
        onClick={onSelectPath}
        tabIndex={-1}
      >
        Velg
      </Checkbox>

      <ToggleVedleggButton hasVedlegg={hasVedlegg} showVedlegg={showVedlegg} toggleShowVedlegg={toggleShowVedlegg} />

      <DocumentTitle
        journalpostId={journalpostId}
        dokumentInfoId={dokumentInfoId}
        hasAccess={hasAccess}
        tittel={tittel ?? ''}
        documentIndex={index}
      />

      {isExpandedListView ? (
        <ExpandedColumns document={document} showMetadata={showMetadata} toggleShowMetadata={toggleShowMetadata} />
      ) : null}

      <IncludeDocument
        dokumentInfoId={dokumentInfoId}
        journalpostId={journalpostId}
        journalpoststatus={journalstatus}
        hasAccess={hasAccess}
        checked={valgt}
      />
    </StyledJournalfoertDocument>
  );
};
