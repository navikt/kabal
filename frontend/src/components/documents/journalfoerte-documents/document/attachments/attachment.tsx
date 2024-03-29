import React, { memo, useCallback, useContext, useRef } from 'react';
import { styled } from 'styled-components';
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
import { IArkivertDocument, IArkivertDocumentVedlegg } from '@app/types/arkiverte-documents';
import { DocumentTitle } from '../shared/document-title';
import { IncludeDocument } from '../shared/include-document';
import { SelectRow } from '../shared/select-row';

interface Props {
  journalpostId: string;
  vedlegg: IArkivertDocumentVedlegg;
  isSelected: boolean;
}

const EMPTY_ARRAY: IArkivertDocument[] = [];

export const Attachment = memo(
  ({ vedlegg, journalpostId, isSelected }: Props) => {
    const { dokumentInfoId, harTilgangTilArkivvariant, tittel } = vedlegg;
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

    const disabled = !harTilgangTilArkivvariant || (!isSaksbehandler && !isRol) || isFeilregistrert;
    const draggingIsEnabled = draggingEnabled && !disabled;

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
        <SelectRow
          journalpostId={journalpostId}
          dokumentInfoId={dokumentInfoId}
          harTilgangTilArkivvariant={harTilgangTilArkivvariant}
        />
        <DocumentTitle
          journalpostId={journalpostId}
          dokumentInfoId={dokumentInfoId}
          tittel={tittel ?? ''}
          harTilgangTilArkivvariant={harTilgangTilArkivvariant}
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
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.vedlegg.valgt === nextProps.vedlegg.valgt &&
    prevProps.vedlegg.tittel === nextProps.vedlegg.tittel,
);

Attachment.displayName = 'Attachment';

const VEDLEGG_FIELDS = [Fields.SelectRow, Fields.Title, Fields.Action];

const StyledVedlegg = styled.article<{ $selected: boolean }>`
  ${documentCSS}
  ${documentsGridCSS}
  grid-template-columns: ${getFieldSizes(VEDLEGG_FIELDS)};
  grid-template-areas: '${getFieldNames(VEDLEGG_FIELDS)}';

  background-color: ${({ $selected }) => getBackgroundColor(false, $selected)};

  &:hover {
    background-color: ${({ $selected }) => getHoverBackgroundColor(false, $selected)};
  }
`;
