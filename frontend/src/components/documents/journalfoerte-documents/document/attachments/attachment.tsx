import { Checkbox, HGrid } from '@navikt/ds-react';
import { memo, useCallback, useContext, useRef } from 'react';
import { createDragUI } from '@/components/documents/create-drag-ui';
import { DragAndDropContext } from '@/components/documents/drag-context';
import { MottattCheckbox } from '@/components/documents/journalfoerte-documents/document/mottatt-checkbox';
import { DocumentTitle } from '@/components/documents/journalfoerte-documents/document/shared/document-title';
import { IncludeDocument } from '@/components/documents/journalfoerte-documents/document/shared/include-document';
import { ToggleVedleggButton } from '@/components/documents/journalfoerte-documents/document/shared/toggle-vedlegg';
import { Fields, getFieldNames, getFieldSizes } from '@/components/documents/journalfoerte-documents/grid';
import { convertRealToAccessibleDocumentIndex } from '@/components/documents/journalfoerte-documents/keyboard/helpers/index-converters';
import { setFocusIndex } from '@/components/documents/journalfoerte-documents/keyboard/state/focus';
import {
  addOne,
  isPathSelected,
  isSelected,
  selectRangeTo,
  unselectOne,
  useIsPathSelected,
} from '@/components/documents/journalfoerte-documents/keyboard/state/selection';
import { SelectContext } from '@/components/documents/journalfoerte-documents/select-context/select-context';
import { DOCUMENT_CLASSES } from '@/components/documents/styled-components/document';
import { findDocument } from '@/domain/find-document';
import { useOppgaveId } from '@/hooks/oppgavebehandling/use-oppgave-id';
import { useIsFeilregistrert } from '@/hooks/use-is-feilregistrert';
import { useIsAssignedRolAndSent } from '@/hooks/use-is-rol';
import { useIsTildeltSaksbehandler } from '@/hooks/use-is-saksbehandler';
import { useGetArkiverteDokumenterQuery } from '@/redux-api/oppgaver/queries/documents';
import { type IArkivertDocument, type IArkivertDocumentVedlegg, Journalstatus } from '@/types/arkiverte-documents';

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
    const { getSelectedDocuments } = useContext(SelectContext);
    const isSaksbehandler = useIsTildeltSaksbehandler();
    const isRol = useIsAssignedRolAndSent();
    const isFeilregistrert = useIsFeilregistrert();

    const documents = arkiverteDokumenter?.dokumenter ?? EMPTY_ARRAY;

    const selected = useIsPathSelected(documentIndex, index);

    const onDragStart = useCallback(
      (e: React.DragEvent<HTMLDivElement>) => {
        if (isPathSelected(documentIndex, index)) {
          const docs = getSelectedDocuments();

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
      [
        documentIndex,
        index,
        getSelectedDocuments,
        documents,
        dokumentInfoId,
        journalpostId,
        setDraggedJournalfoertDocuments,
      ],
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
    const draggingIsEnabled = draggingEnabled && !disabled && hasAccess && journalpoststatus !== Journalstatus.MOTTATT;

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
        gap="space-0 space-8"
        columns={getFieldSizes(VEDLEGG_FIELDS)}
        ref={ref}
        key={journalpostId + dokumentInfoId}
        data-journalpostid={journalpostId}
        data-dokumentinfoid={dokumentInfoId}
        data-documentname={tittel}
        onDragStart={draggingIsEnabled ? onDragStart : (e) => e.preventDefault()}
        onDragEnd={() => {
          cleanDragUI.current();
          clearDragState();
        }}
        draggable={draggingIsEnabled}
        className={`${DOCUMENT_CLASSES} pr-1.5 pl-1.5`}
        style={{ gridTemplateAreas: `"${getFieldNames(VEDLEGG_FIELDS)}"` }}
        onClick={onClick}
        onDoubleClick={hasAccess && journalpoststatus !== Journalstatus.MOTTATT ? onDoubleClick : undefined}
        tabIndex={-1}
      >
        {journalpoststatus === Journalstatus.MOTTATT ? (
          <MottattCheckbox />
        ) : (
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
        )}

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
