import { createDragUI } from '@app/components/documents/create-drag-ui';
import { DragAndDropContext } from '@app/components/documents/drag-context';
import { ExpandedColumns } from '@app/components/documents/journalfoerte-documents/document/expanded-columns';
import { ToggleVedleggButton } from '@app/components/documents/journalfoerte-documents/document/shared/toggle-vedlegg';
import { Fields, getFieldNames, getFieldSizes } from '@app/components/documents/journalfoerte-documents/grid';
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
import { DOCUMENT_CLASSES } from '@app/components/documents/styled-components/document';
import { isNotNull } from '@app/functions/is-not-type-guards';
import { useArchivedDocumentsColumns } from '@app/hooks/settings/use-archived-documents-setting';
import { useHasDocumentsAccess } from '@app/hooks/use-has-documents-access';
import { useIsAssignedRolAndSent } from '@app/hooks/use-is-rol';
import type { IArkivertDocument } from '@app/types/arkiverte-documents';
import { Checkbox, HGrid } from '@navikt/ds-react';
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
  const isRol = useIsAssignedRolAndSent();
  const hasDocumentsAccess = useHasDocumentsAccess();
  const { columns } = useArchivedDocumentsColumns();

  const { getSelectedDocuments } = useContext(SelectContext);
  const { setDraggedJournalfoertDocuments, clearDragState, draggingEnabled } = useContext(DragAndDropContext);

  const cleanDragUI = useRef<() => void>(() => undefined);

  const { dokumentInfoId, journalpostId, tittel, hasAccess, journalstatus, varianter } = document;

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

  const onClick: React.MouseEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      if (!hasAccess) {
        return;
      }

      const accessibleIndex = convertRealToAccessibleDocumentIndex([index, -1]);

      if (accessibleIndex === undefined) {
        return;
      }

      if (e.shiftKey) {
        selectRangeTo(accessibleIndex);
      } else {
        setFocusIndex(accessibleIndex);
      }
    },
    [index, hasAccess],
  );

  const fields = [
    Fields.Select,
    Fields.ToggleVedlegg,
    Fields.Title,
    columns.TEMA ? Fields.Tema : null,
    columns.DATO_OPPRETTET ? Fields.DatoOpprettet : null,
    columns.DATO_SORTERING ? Fields.DatoSortering : null,
    columns.AVSENDER_MOTTAKER ? Fields.AvsenderMottaker : null,
    columns.SAKSNUMMER ? Fields.Saksnummer : null,
    columns.TYPE ? Fields.Type : null,
    Fields.ToggleMetadata,
    Fields.Action,
  ].filter(isNotNull);

  return (
    <HGrid
      as="article"
      gap="0 2"
      align="center"
      paddingInline="1-alt"
      columns={isExpandedListView ? getFieldSizes(fields) : getFieldSizes(COLLAPSED_JOURNALFOERTE_DOCUMENT_FIELDS)}
      ref={ref}
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
      onClick={onClick}
      onDoubleClick={hasAccess ? onDoubleClick : undefined}
      tabIndex={-1}
      className={`${DOCUMENT_CLASSES} ${className}`}
      style={{
        gridTemplateAreas: `"${isExpandedListView ? getFieldNames(fields) : getFieldNames(COLLAPSED_JOURNALFOERTE_DOCUMENT_FIELDS)}"`,
      }}
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
        varianter={varianter}
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
      />
    </HGrid>
  );
};

const COLLAPSED_JOURNALFOERTE_DOCUMENT_FIELDS = [Fields.Select, Fields.ToggleVedlegg, Fields.Title, Fields.Action];
