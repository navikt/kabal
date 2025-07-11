import { createDragUI } from '@app/components/documents/create-drag-ui';
import { DragAndDropContext } from '@app/components/documents/drag-context';
import { ToggleVedleggButton } from '@app/components/documents/journalfoerte-documents/document/shared/toggle-vedlegg';
import { Fields, getFieldNames, getFieldSizes } from '@app/components/documents/journalfoerte-documents/grid';
import { convertRealToAccessibleDocumentIndex } from '@app/components/documents/journalfoerte-documents/keyboard/helpers/index-converters';
import { setFocusIndex } from '@app/components/documents/journalfoerte-documents/keyboard/state/focus';
import {
  addOne,
  getSelectedDocuments,
  isPathSelected,
  isSelected,
  selectRangeTo,
  unselectOne,
  useIsPathSelected,
} from '@app/components/documents/journalfoerte-documents/keyboard/state/selection';
import { DOCUMENT_CLASSES } from '@app/components/documents/styled-components/document';
import { findDocument } from '@app/domain/find-document';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useIsFeilregistrert } from '@app/hooks/use-is-feilregistrert';
import { useIsAssignedRolAndSent } from '@app/hooks/use-is-rol';
import { useIsTildeltSaksbehandler } from '@app/hooks/use-is-saksbehandler';
import { useGetArkiverteDokumenterQuery } from '@app/redux-api/oppgaver/queries/documents';
import type { IArkivertDocument, IArkivertDocumentVedlegg, Journalstatus } from '@app/types/arkiverte-documents';
import { Checkbox, HGrid } from '@navikt/ds-react';
import { memo, useCallback, useContext, useRef } from 'react';
import { DocumentTitle } from '../shared/document-title';
import { IncludeDocument } from '../shared/include-document';

interface Props {
  journalpostId: string;
  journalpoststatus: Journalstatus | null;
  vedlegg: IArkivertDocumentVedlegg;
  showVedlegg: boolean;
  toggleShowVedlegg: () => void;
  hasVedlegg: boolean;
  index: number;
  documentIndex: number;
}

const EMPTY_ARRAY: IArkivertDocument[] = [];

export const Attachment = memo(
  ({
    vedlegg,
    journalpostId,
    journalpoststatus,
    showVedlegg,
    toggleShowVedlegg,
    hasVedlegg,
    index,
    documentIndex,
  }: Props) => {
    const { dokumentInfoId, hasAccess, tittel, varianter } = vedlegg;
    const oppgaveId = useOppgaveId();
    const { data: arkiverteDokumenter } = useGetArkiverteDokumenterQuery(oppgaveId);
    const cleanDragUI = useRef<() => void>(() => undefined);
    const { setDraggedJournalfoertDocuments, clearDragState, draggingEnabled } = useContext(DragAndDropContext);
    const isSaksbehandler = useIsTildeltSaksbehandler();
    const isRol = useIsAssignedRolAndSent();
    const isFeilregistrert = useIsFeilregistrert();

    const documents = arkiverteDokumenter?.dokumenter ?? EMPTY_ARRAY;

    const selected = useIsPathSelected(documentIndex, index);

    const onDragStart = useCallback(
      (e: React.DragEvent<HTMLDivElement>) => {
        if (isPathSelected(documentIndex, index)) {
          const docs = getSelectedDocuments(documents);

          cleanDragUI.current = createDragUI(
            docs.map((d) => d.tittel ?? 'Ukjent dokument'),
            e,
          );

          e.dataTransfer.effectAllowed = 'link';
          e.dataTransfer.dropEffect = 'link';
          setDraggedJournalfoertDocuments(docs);

          return;
        }

        const doc = findDocument(journalpostId, dokumentInfoId, documents);

        if (doc === undefined) {
          return;
        }

        cleanDragUI.current = createDragUI([doc.tittel ?? 'Ukjent dokument'], e);

        e.dataTransfer.effectAllowed = 'link';
        e.dataTransfer.dropEffect = 'link';
        setDraggedJournalfoertDocuments([doc]);
      },
      [documentIndex, index, documents, dokumentInfoId, journalpostId, setDraggedJournalfoertDocuments],
    );

    const onDoubleClick = useCallback(() => {
      const accessibleIndex = convertRealToAccessibleDocumentIndex([documentIndex, index]);

      if (accessibleIndex === undefined) {
        return;
      }

      setFocusIndex(accessibleIndex);
      isPathSelected(documentIndex, index) ? unselectOne(accessibleIndex) : addOne(accessibleIndex);
    }, [documentIndex, index]);

    const disabled = !(isSaksbehandler || isRol) || isFeilregistrert;
    const draggingIsEnabled = draggingEnabled && !disabled && hasAccess;

    const onSelectPath = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();

        const accessibleIndex = convertRealToAccessibleDocumentIndex([documentIndex, index]);

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
      [documentIndex, index],
    );

    const onClick: React.MouseEventHandler<HTMLDivElement> = useCallback(
      (e) => {
        if (!hasAccess) {
          return;
        }

        const accessibleIndex = convertRealToAccessibleDocumentIndex([documentIndex, index]);

        if (accessibleIndex === undefined) {
          return;
        }

        if (e.shiftKey) {
          selectRangeTo(accessibleIndex);
        } else {
          setFocusIndex(accessibleIndex);
        }
      },
      [documentIndex, index, hasAccess],
    );

    const ref = useRef<HTMLDivElement>(null);

    return (
      <HGrid
        as="article"
        gap="0 2"
        paddingInline="1-alt"
        columns={getFieldSizes(VEDLEGG_FIELDS)}
        ref={ref}
        key={journalpostId + dokumentInfoId}
        data-testid="oppgavebehandling-documents-all-list-item"
        data-journalpostid={journalpostId}
        data-dokumentinfoid={dokumentInfoId}
        data-documentname={tittel}
        onDragStart={draggingIsEnabled ? onDragStart : (e) => e.preventDefault()}
        onDragEnd={() => {
          cleanDragUI.current();
          clearDragState();
        }}
        draggable={draggingIsEnabled}
        className={DOCUMENT_CLASSES}
        style={{ gridTemplateAreas: `"${getFieldNames(VEDLEGG_FIELDS)}"` }}
        onClick={onClick}
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
          tittel={tittel ?? ''}
          hasAccess={hasAccess}
          documentIndex={documentIndex}
          vedleggIndex={index}
          varianter={varianter}
        />

        <IncludeDocument
          dokumentInfoId={dokumentInfoId}
          journalpostId={journalpostId}
          journalpoststatus={journalpoststatus}
          hasAccess={hasAccess}
        />
      </HGrid>
    );
  },
  (prevProps, nextProps) =>
    prevProps.documentIndex === nextProps.documentIndex &&
    prevProps.index === nextProps.index &&
    prevProps.showVedlegg === nextProps.showVedlegg &&
    prevProps.journalpostId === nextProps.journalpostId &&
    prevProps.toggleShowVedlegg === nextProps.toggleShowVedlegg &&
    prevProps.hasVedlegg === nextProps.hasVedlegg &&
    prevProps.vedlegg.tittel === nextProps.vedlegg.tittel,
);

Attachment.displayName = 'Attachment';

const VEDLEGG_FIELDS = [Fields.Select, Fields.ToggleVedlegg, Fields.Title, Fields.Action];
