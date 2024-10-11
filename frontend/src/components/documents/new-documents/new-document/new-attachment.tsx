import { createDragUI } from '@app/components/documents/create-drag-ui';
import { DragAndDropContext } from '@app/components/documents/drag-context';
import {
  COLLAPSED_NEW_DOCUMENT_FIELDS,
  EXPANDED_NEW_ATTACHMENT_FIELDS,
  Fields,
  getFieldNames,
  getFieldSizes,
} from '@app/components/documents/new-documents/grid';
import { DocumentModal } from '@app/components/documents/new-documents/modal/modal';
import { ArchivingIcon } from '@app/components/documents/new-documents/new-document/archiving-icon';
import { DocumentDate } from '@app/components/documents/new-documents/shared/document-date';
import { documentCSS } from '@app/components/documents/styled-components/document';
import { useIsExpanded } from '@app/components/documents/use-is-expanded';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useCanEditDocument } from '@app/hooks/use-can-document/use-can-edit-document';
import { useLazyGetDocumentsQuery } from '@app/redux-api/oppgaver/queries/documents';
import { DocumentTypeEnum, type IMainDocument } from '@app/types/documents/documents';
import { skipToken } from '@reduxjs/toolkit/query';
import { memo, useCallback, useContext, useRef } from 'react';
import { styled } from 'styled-components';
import { DocumentTitle } from './title';

interface Props {
  document: IMainDocument;
  parentDocument: IMainDocument;
  containsRolAttachments: boolean;
}

export const NewAttachment = ({ document, parentDocument, containsRolAttachments }: Props) => {
  const oppgaveId = useOppgaveId();
  const [getDocuments] = useLazyGetDocumentsQuery();
  const [isExpanded] = useIsExpanded();
  const cleanDragUI = useRef<() => void>(() => undefined);
  const { setDraggedDocument, clearDragState, draggingEnabled } = useContext(DragAndDropContext);
  const canEdit = useCanEditDocument(document, parentDocument);

  const onDragStart = useCallback(
    async (e: React.DragEvent<HTMLDivElement>) => {
      if (oppgaveId === skipToken) {
        return;
      }

      if (document.parentId === null) {
        const titles: string[] = [document.tittel];

        const data = await getDocuments(oppgaveId, true).unwrap();

        for (const d of data) {
          if (d.parentId === document.id) {
            titles.push(d.tittel);
          }
        }

        cleanDragUI.current = createDragUI(titles, e);
      } else {
        cleanDragUI.current = createDragUI([document.tittel], e);
      }

      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.dropEffect = 'move';
      setDraggedDocument(document);
    },
    [document, getDocuments, oppgaveId, setDraggedDocument],
  );

  return (
    <NewAttachmentInternal
      document={document}
      parentDocument={parentDocument}
      isExpanded={isExpanded}
      cleanDragUI={cleanDragUI}
      clearDragState={clearDragState}
      draggingEnabled={draggingEnabled}
      canEdit={canEdit}
      onDragStart={onDragStart}
      containsRolAttachments={containsRolAttachments}
    />
  );
};

interface NewDocumentInternalProps {
  document: IMainDocument;
  parentDocument: IMainDocument;
  isExpanded: boolean;
  cleanDragUI: React.MutableRefObject<() => void>;
  clearDragState: () => void;
  draggingEnabled: boolean;
  canEdit: boolean;
  containsRolAttachments: boolean;
  onDragStart: (e: React.DragEvent<HTMLDivElement>) => void;
}

const NewAttachmentInternal = memo<NewDocumentInternalProps>(
  ({
    document,
    parentDocument,
    isExpanded,
    cleanDragUI,
    clearDragState,
    draggingEnabled,
    canEdit,
    containsRolAttachments,
    onDragStart,
  }) => {
    const isDraggable = draggingEnabled && canEdit;

    return (
      <StyledNewAttachment
        $isExpanded={isExpanded}
        data-documentname={document.tittel}
        data-documentid={document.id}
        data-testid="new-document-list-item-content"
        data-documenttype="attachment"
        onDragStart={isDraggable ? onDragStart : (e) => e.preventDefault()}
        onDragEnd={() => {
          cleanDragUI.current();
          clearDragState();
        }}
        draggable={isDraggable}
      >
        <DocumentTitle document={document} />
        {isExpanded && document.type === DocumentTypeEnum.JOURNALFOERT ? (
          <StyledDate data-testid="new-document-date" document={document} />
        ) : null}
        {parentDocument.isMarkertAvsluttet ? (
          <ArchivingIcon dokumentTypeId={document.dokumentTypeId} />
        ) : (
          <DocumentModal
            document={document}
            parentDocument={parentDocument}
            containsRolAttachments={containsRolAttachments}
          />
        )}
      </StyledNewAttachment>
    );
  },
  (prev, next) =>
    prev.document === next.document &&
    prev.isExpanded === next.isExpanded &&
    prev.draggingEnabled === next.draggingEnabled &&
    prev.canEdit === next.canEdit &&
    prev.containsRolAttachments === next.containsRolAttachments,
);

NewAttachmentInternal.displayName = 'NewAttachmentInternal';

const StyledDate = styled(DocumentDate)`
  grid-area: ${Fields.TypeOrDate};
  overflow: hidden;
  text-overflow: ellipsis;
`;

const getGridFields = ({ $isExpanded }: StlyedNewAttachmentProps) =>
  $isExpanded ? EXPANDED_NEW_ATTACHMENT_FIELDS : COLLAPSED_NEW_DOCUMENT_FIELDS;

interface StlyedNewAttachmentProps {
  $isExpanded: boolean;
}

export const StyledNewAttachment = styled.article<StlyedNewAttachmentProps>`
  ${documentCSS}
  display: grid;
  grid-column-gap: var(--a-spacing-2);
  align-items: center;
  padding-left: 6px;
  padding-right: 0;
  grid-template-columns: ${(props) => getFieldSizes(getGridFields(props))};
  grid-template-areas: '${(props) => getFieldNames(getGridFields(props))}';

  &:hover {
    background-color: var(--a-surface-hover);
  }
`;
