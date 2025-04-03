import { createDragUI } from '@app/components/documents/create-drag-ui';
import { DragAndDropContext } from '@app/components/documents/drag-context';
import {
  Fields,
  documentsGridCSS,
  getFieldNames,
  getFieldSizes,
} from '@app/components/documents/journalfoerte-documents/grid';
import { SelectContext } from '@app/components/documents/journalfoerte-documents/select-context/select-context';
import {
  documentCSS,
  getBackgroundColor,
  getHoverBackgroundColor,
} from '@app/components/documents/styled-components/document';
import { findDocument } from '@app/domain/find-document';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useIsFeilregistrert } from '@app/hooks/use-is-feilregistrert';
import { useIsRol } from '@app/hooks/use-is-rol';
import { useIsSaksbehandler } from '@app/hooks/use-is-saksbehandler';
import { useGetArkiverteDokumenterQuery } from '@app/redux-api/oppgaver/queries/documents';
import type { IArkivertDocument, IArkivertDocumentVedlegg } from '@app/types/arkiverte-documents';
import { ChevronDownDoubleIcon, ChevronDownIcon, ChevronUpDoubleIcon, ChevronUpIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import { memo, useCallback, useContext, useMemo, useRef } from 'react';
import { styled } from 'styled-components';
import { DocumentTitle } from '../shared/document-title';
import { IncludeDocument } from '../shared/include-document';
import { SelectRow } from '../shared/select-row';

interface Props {
  journalpostId: string;
  vedlegg: IArkivertDocumentVedlegg;
  isSelected: boolean;
  showVedlegg: boolean;
  toggleShowVedlegg: () => void;
  hasVedlegg: boolean;
}

const EMPTY_ARRAY: IArkivertDocument[] = [];

export const Attachment = memo(
  ({ vedlegg, journalpostId, isSelected, showVedlegg, toggleShowVedlegg, hasVedlegg }: Props) => {
    const { dokumentInfoId, hasAccess, tittel } = vedlegg;
    const oppgaveId = useOppgaveId();
    const { data: arkiverteDokumenter } = useGetArkiverteDokumenterQuery(oppgaveId);
    const { getSelectedDocuments } = useContext(SelectContext);
    const cleanDragUI = useRef<() => void>(() => undefined);
    const { setDraggedJournalfoertDocuments, clearDragState, draggingEnabled } = useContext(DragAndDropContext);
    const isSaksbehandler = useIsSaksbehandler();
    const isRol = useIsRol();
    const isFeilregistrert = useIsFeilregistrert();

    const documents = arkiverteDokumenter?.dokumenter ?? EMPTY_ARRAY;

    const onDragStart = useCallback(
      (e: React.DragEvent<HTMLDivElement>) => {
        if (isSelected) {
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
      [documents, dokumentInfoId, getSelectedDocuments, isSelected, journalpostId, setDraggedJournalfoertDocuments],
    );

    const disabled = !(hasAccess && (isSaksbehandler || isRol)) || isFeilregistrert;
    const draggingIsEnabled = draggingEnabled && !disabled;

    const Icon = useMemo(() => {
      if (hasVedlegg) {
        return showVedlegg ? ChevronUpDoubleIcon : ChevronDownDoubleIcon;
      }

      return showVedlegg ? ChevronUpIcon : ChevronDownIcon;
    }, [hasVedlegg, showVedlegg]);

    return (
      <StyledVedlegg
        key={journalpostId + dokumentInfoId}
        data-testid="oppgavebehandling-documents-all-list-item"
        data-journalpostid={journalpostId}
        data-dokumentinfoid={dokumentInfoId}
        data-documentname={tittel}
        $selected={isSelected}
        onDragStart={draggingIsEnabled ? onDragStart : (e) => e.preventDefault()}
        onDragEnd={() => {
          cleanDragUI.current();
          clearDragState();
        }}
        draggable={draggingIsEnabled}
      >
        <SelectRow journalpostId={journalpostId} dokumentInfoId={dokumentInfoId} hasAccess={hasAccess} />

        <Button
          variant="tertiary"
          size="small"
          icon={<Icon aria-hidden />}
          onClick={toggleShowVedlegg}
          aria-label={showVedlegg ? 'Skjul vedlegg' : 'Vis vedlegg'}
          style={{ gridArea: Fields.ToggleVedlegg }}
        />

        <DocumentTitle
          journalpostId={journalpostId}
          dokumentInfoId={dokumentInfoId}
          tittel={tittel ?? ''}
          hasAccess={hasAccess}
        />

        <IncludeDocument
          dokumentInfoId={dokumentInfoId}
          journalpostId={journalpostId}
          disabled={disabled}
          name={tittel ?? ''}
          checked={vedlegg.valgt}
        />
      </StyledVedlegg>
    );
  },
  (prevProps, nextProps) =>
    prevProps.showVedlegg === nextProps.showVedlegg &&
    prevProps.journalpostId === nextProps.journalpostId &&
    prevProps.toggleShowVedlegg === nextProps.toggleShowVedlegg &&
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.hasVedlegg === nextProps.hasVedlegg &&
    prevProps.vedlegg.valgt === nextProps.vedlegg.valgt &&
    prevProps.vedlegg.tittel === nextProps.vedlegg.tittel,
);

Attachment.displayName = 'Attachment';

const VEDLEGG_FIELDS = [Fields.SelectRow, Fields.ToggleVedlegg, Fields.Title, Fields.Action];

const StyledVedlegg = styled.article<{ $selected: boolean }>`
  ${documentCSS}
  ${documentsGridCSS}
  grid-template-columns: ${getFieldSizes(VEDLEGG_FIELDS)};
  grid-template-areas: '${getFieldNames(VEDLEGG_FIELDS)}';

  background-color: ${({ $selected }) => getBackgroundColor($selected)};

  &:hover {
    background-color: ${({ $selected }) => getHoverBackgroundColor($selected)};
  }
`;
