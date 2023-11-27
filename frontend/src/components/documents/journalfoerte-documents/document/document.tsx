import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import React, { memo, useCallback, useContext, useRef, useState } from 'react';
import { styled } from 'styled-components';
import { createDragUI } from '@app/components/documents/create-drag-ui';
import { DragAndDropContext } from '@app/components/documents/drag-context';
import { ExpandedColumns } from '@app/components/documents/journalfoerte-documents/document/expanded-columns';
import { SelectRow } from '@app/components/documents/journalfoerte-documents/document/shared/select-row';
import { StyledJournalfoertDocument } from '@app/components/documents/journalfoerte-documents/document/styled-journalfoert-document';
import { Fields } from '@app/components/documents/journalfoerte-documents/grid';
import { SelectContext } from '@app/components/documents/journalfoerte-documents/select-context/select-context';
import { useIsExpanded } from '@app/components/documents/use-is-expanded';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useArchivedDocumentsColumns } from '@app/hooks/settings/use-archived-documents-setting';
import { useHasDocumentsAccess } from '@app/hooks/use-has-documents-access';
import { useIsRol } from '@app/hooks/use-is-rol';
import { useIsSaksbehandler } from '@app/hooks/use-is-saksbehandler';
import { IArkivertDocument } from '@app/types/arkiverte-documents';
import { AttachmentList } from './attachments/attachment-list';
import { ExpandedDocument } from './expanded-document';
import { DocumentTitle } from './shared/document-title';
import { IncludeDocument } from './shared/include-document';

interface Props {
  document: IArkivertDocument;
  isSelected: boolean;
}

export const Document = memo(
  ({ document, isSelected }: Props) => {
    const oppgaveId = useOppgaveId();
    const [expanded, setExpanded] = useState(false);
    const isSaksbehandler = useIsSaksbehandler();
    const isRol = useIsRol();
    const hasDocumentsAccess = useHasDocumentsAccess();
    const { columns } = useArchivedDocumentsColumns();

    const [isExpanded] = useIsExpanded();

    const { getSelectedDocuments } = useContext(SelectContext);
    const { setDraggedJournalfoertDocuments, clearDragState, draggingEnabled } = useContext(DragAndDropContext);

    const cleanDragUI = useRef<() => void>(() => undefined);

    const { dokumentInfoId, journalpostId, tittel, harTilgangTilArkivvariant, valgt } = document;

    const toggleExpanded = () => setExpanded(!expanded);
    const Icon = expanded ? ChevronUpIcon : ChevronDownIcon;

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
      <>
        <StyledJournalfoertDocument
          $expanded={expanded}
          $isExpanded={isExpanded}
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
            disabled={disabled}
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
