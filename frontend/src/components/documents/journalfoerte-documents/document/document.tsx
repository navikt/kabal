import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import React, { memo, useCallback, useContext, useRef, useState } from 'react';
import { styled } from 'styled-components';
import { createDragUI } from '@app/components/documents/create-drag-ui';
import { DragAndDropContext } from '@app/components/documents/drag-context';
import { ExpandedColumns } from '@app/components/documents/journalfoerte-documents/document/expanded-columns';
import { SelectRow } from '@app/components/documents/journalfoerte-documents/document/shared/select-row';
import {
  Fields,
  collapsedJournalfoerteDocumentsGridCSS,
  expandedJournalfoerteDocumentsGridCSS,
} from '@app/components/documents/journalfoerte-documents/grid';
import { SelectContext } from '@app/components/documents/journalfoerte-documents/select-context/select-context';
import {
  documentCSS,
  getBackgroundColor,
  getHoverBackgroundColor,
} from '@app/components/documents/styled-components/document';
import { useIsExpanded } from '@app/components/documents/use-is-expanded';
import { findDocument } from '@app/domain/find-document';
import { isNotUndefined } from '@app/functions/is-not-type-guards';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useGetArkiverteDokumenterQuery } from '@app/redux-api/oppgaver/queries/documents';
import { IArkivertDocument } from '@app/types/arkiverte-documents';
import { AttachmentList } from './attachments/attachment-list';
import { ExpandedDocument } from './expanded-document';
import { DocumentTitle } from './shared/document-title';
import { IncludeDocument } from './shared/include-document';

interface Props {
  document: IArkivertDocument;
  isSelected: boolean;
}

const EMPTY_ARRAY: IArkivertDocument[] = [];

export const Document = memo(
  ({ document, isSelected }: Props) => {
    const oppgaveId = useOppgaveId();
    const [expanded, setExpanded] = useState(false);

    const [isExpanded] = useIsExpanded();

    const { selectedDocuments } = useContext(SelectContext);
    const { setDraggedJournalfoertDocuments, clearDragState } = useContext(DragAndDropContext);

    const cleanDragUI = useRef<() => void>(() => undefined);

    const { data } = useGetArkiverteDokumenterQuery(oppgaveId);
    const documents = data?.dokumenter ?? EMPTY_ARRAY;

    const { dokumentInfoId, journalpostId, tittel, harTilgangTilArkivvariant, valgt } = document;

    const toggleExpanded = () => setExpanded(!expanded);
    const Icon = expanded ? ChevronUpIcon : ChevronDownIcon;

    const onDragStart = useCallback(
      (e: React.DragEvent<HTMLDivElement>) => {
        e.dataTransfer.clearData();

        const docs = isSelected
          ? Object.values(selectedDocuments)
              .map((s) => findDocument(s.dokumentInfoId, documents))
              .filter(isNotUndefined)
          : [document];

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
      [document, documents, isSelected, selectedDocuments, setDraggedJournalfoertDocuments],
    );

    return (
      <>
        <StyledJournalfoertDocument
          $expanded={expanded}
          $isExpanded={isExpanded}
          $selected={isSelected}
          data-testid="document-journalfoert"
          data-journalpostid={journalpostId}
          data-dokumentinfoid={dokumentInfoId}
          data-documentname={tittel}
          onDragStart={onDragStart}
          onDragEnd={() => {
            cleanDragUI.current();
            clearDragState();
          }}
          draggable
        >
          <SelectRow journalpostId={journalpostId} dokumentInfoId={dokumentInfoId} />
          {isExpanded ? (
            <ExpandButton variant="tertiary" size="small" icon={<Icon aria-hidden />} onClick={toggleExpanded} />
          ) : null}
          <DocumentTitle
            journalpostId={journalpostId}
            dokumentInfoId={dokumentInfoId}
            harTilgangTilArkivvariant={harTilgangTilArkivvariant}
            tittel={tittel ?? ''}
          />

          {isExpanded ? <ExpandedColumns document={document} /> : null}

          <IncludeDocument
            dokumentInfoId={dokumentInfoId}
            journalpostId={journalpostId}
            harTilgangTilArkivvariant={harTilgangTilArkivvariant}
            name={tittel ?? ''}
            oppgavebehandlingId={oppgaveId}
            checked={valgt}
          />
        </StyledJournalfoertDocument>
        {expanded && isExpanded ? <ExpandedDocument document={document} /> : null}
        <AttachmentList document={document} oppgaveId={oppgaveId} />
      </>
    );
  },
  (prevProps, nextProps) => {
    const propsAreEqual =
      prevProps.isSelected === nextProps.isSelected &&
      prevProps.document.valgt === nextProps.document.valgt &&
      prevProps.document.tittel === nextProps.document.tittel &&
      prevProps.document.vedlegg.length === nextProps.document.vedlegg.length &&
      prevProps.document.vedlegg.every((v, i) => {
        const n = nextProps.document.vedlegg[i];

        if (n === undefined) {
          return false;
        }

        return v.valgt === n.valgt && v.tittel === n.tittel && v.dokumentInfoId === n.dokumentInfoId;
      });

    return propsAreEqual;
  },
);

Document.displayName = 'Document';

const ExpandButton = styled(Button)`
  grid-area: ${Fields.Expand};
`;

const StyledJournalfoertDocument = styled.article<{
  $expanded: boolean;
  $selected: boolean;
  $isExpanded: boolean;
}>`
  ${documentCSS}
  ${({ $isExpanded }) => ($isExpanded ? expandedJournalfoerteDocumentsGridCSS : collapsedJournalfoerteDocumentsGridCSS)}
  background-color: ${({ $expanded, $selected }) => getBackgroundColor($expanded, $selected)};

  &:hover {
    background-color: ${({ $expanded, $selected }) => getHoverBackgroundColor($expanded, $selected)};
  }
`;
