import React, { memo, useCallback, useContext, useRef, useState } from 'react';
import { createDragUI } from '@app/components/documents/create-drag-ui';
import { SelectContext } from '@app/components/documents/expanded/journalfoerte-documents/select-context/select-context';
import { findDocument } from '@app/domain/find-document';
import { isNotUndefined } from '@app/functions/is-not-type-guards';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useGetArkiverteDokumenterQuery } from '@app/redux-api/oppgaver/queries/documents';
import { IArkivertDocument, IArkivertDocumentVedlegg } from '@app/types/arkiverte-documents';
import { DragAndDropTypesEnum } from '@app/types/drag-and-drop';
import { StyledVedlegg } from '../styled-components/document';
import { DocumentTitle } from './document-title';
import { IncludeDocument } from './include-document';
import { SelectRow } from './select-row';

interface Props {
  oppgavebehandlingId: string;
  journalpostId: string;
  vedlegg: IArkivertDocumentVedlegg;
  isSelected: boolean;
}

const EMPTY_ARRAY: IArkivertDocument[] = [];

export const Attachment = memo(
  ({ oppgavebehandlingId, vedlegg, journalpostId, isSelected }: Props) => {
    const { dokumentInfoId, harTilgangTilArkivvariant, tittel } = vedlegg;
    const oppgaveId = useOppgaveId();
    const { data: arkiverteDokumenter } = useGetArkiverteDokumenterQuery(oppgaveId);
    const [isDragging, setIsDragging] = useState(false);
    const { selectedDocuments } = useContext(SelectContext);
    const cleanDragUI = useRef<() => void>(() => undefined);

    const documents = arkiverteDokumenter?.dokumenter ?? EMPTY_ARRAY;

    const onDragStart = useCallback(
      (e: React.DragEvent<HTMLDivElement>) => {
        setIsDragging(true);
        e.dataTransfer.clearData();

        if (isSelected) {
          const docs = Object.values(selectedDocuments)
            .map((s) => findDocument(s.dokumentInfoId, documents))
            .filter(isNotUndefined);

          cleanDragUI.current = createDragUI(
            docs.map((d) => d.tittel ?? 'Ukjent dokument'),
            e
          );

          e.dataTransfer.effectAllowed = 'link';
          e.dataTransfer.dropEffect = 'link';
          e.dataTransfer.setData(DragAndDropTypesEnum.JOURNALFOERT_DOCUMENT, JSON.stringify(docs));

          return;
        }

        const doc = findDocument(dokumentInfoId, documents);

        if (doc === undefined) {
          return;
        }

        cleanDragUI.current = createDragUI([doc.tittel ?? 'Ukjent dokument'], e);

        e.dataTransfer.effectAllowed = 'link';
        e.dataTransfer.dropEffect = 'link';
        e.dataTransfer.setData(DragAndDropTypesEnum.JOURNALFOERT_DOCUMENT, JSON.stringify([doc]));
      },
      [documents, dokumentInfoId, isSelected, selectedDocuments]
    );

    return (
      <StyledVedlegg
        key={journalpostId + dokumentInfoId}
        data-testid="oppgavebehandling-documents-all-list-item"
        data-journalpostid={journalpostId}
        data-dokumentinfoid={dokumentInfoId}
        data-documentname={tittel}
        $selected={isSelected}
        onDragStart={onDragStart}
        onDragEnd={() => {
          setIsDragging(false);
          cleanDragUI.current();
        }}
        draggable={!isDragging}
      >
        <SelectRow journalpostId={journalpostId} dokumentInfoId={dokumentInfoId} />
        <DocumentTitle
          journalpostId={journalpostId}
          dokumentInfoId={dokumentInfoId}
          tittel={tittel ?? ''}
          harTilgangTilArkivvariant={harTilgangTilArkivvariant}
        />
        <IncludeDocument
          dokumentInfoId={dokumentInfoId}
          journalpostId={journalpostId}
          harTilgangTilArkivvariant={harTilgangTilArkivvariant}
          name={tittel ?? ''}
          oppgavebehandlingId={oppgavebehandlingId}
          checked={vedlegg.valgt}
        />
      </StyledVedlegg>
    );
  },
  (prevProps, nextProps) =>
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.vedlegg.valgt === nextProps.vedlegg.valgt &&
    prevProps.vedlegg.tittel === nextProps.vedlegg.tittel
);

Attachment.displayName = 'Attachment';
