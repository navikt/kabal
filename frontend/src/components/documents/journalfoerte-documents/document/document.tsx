import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import React, { useCallback, useContext, useRef } from 'react';
import { styled } from 'styled-components';
import { createDragUI } from '@app/components/documents/create-drag-ui';
import { DragAndDropContext } from '@app/components/documents/drag-context';
import { ExpandedColumns } from '@app/components/documents/journalfoerte-documents/document/expanded-columns';
import { SelectRow } from '@app/components/documents/journalfoerte-documents/document/shared/select-row';
import { StyledJournalfoertDocument } from '@app/components/documents/journalfoerte-documents/document/styled-journalfoert-document';
import { DocumentContext } from '@app/components/documents/journalfoerte-documents/document-context';
import { Fields } from '@app/components/documents/journalfoerte-documents/grid';
import { SelectContext } from '@app/components/documents/journalfoerte-documents/select-context/select-context';
import { useArchivedDocumentsColumns } from '@app/hooks/settings/use-archived-documents-setting';
import { useHasDocumentsAccess } from '@app/hooks/use-has-documents-access';
import { useIsRol } from '@app/hooks/use-is-rol';
import { useIsSaksbehandler } from '@app/hooks/use-is-saksbehandler';
import { IArkivertDocument } from '@app/types/arkiverte-documents';
import { DocumentTitle } from './shared/document-title';
import { IncludeDocument } from './shared/include-document';

interface Props {
  document: IArkivertDocument;
  isSelected: boolean;
  isExpanded: boolean;
}

export const Document = ({ document, isSelected, isExpanded }: Props) => {
  const isSaksbehandler = useIsSaksbehandler();
  const isRol = useIsRol();
  const hasDocumentsAccess = useHasDocumentsAccess();
  const { columns } = useArchivedDocumentsColumns();
  const { setExpandedIds, expandedIds } = useContext(DocumentContext);

  const { getSelectedDocuments } = useContext(SelectContext);
  const { setDraggedJournalfoertDocuments, clearDragState, draggingEnabled } = useContext(DragAndDropContext);

  const cleanDragUI = useRef<() => void>(() => undefined);

  const { dokumentInfoId, journalpostId, tittel, harTilgangTilArkivvariant, valgt } = document;

  const expanded = expandedIds.includes(journalpostId);

  const toggleExpanded = () =>
    expanded
      ? setExpandedIds(expandedIds.filter((id) => id !== journalpostId))
      : setExpandedIds([...expandedIds, journalpostId]);

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
        checked={valgt}
      />
    </StyledJournalfoertDocument>
  );
};

Document.displayName = 'Document';

const ExpandButton = styled(Button)`
  grid-area: ${Fields.Expand};
`;
