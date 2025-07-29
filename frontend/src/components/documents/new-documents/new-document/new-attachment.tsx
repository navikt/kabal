import { createDragUI } from '@app/components/documents/create-drag-ui';
import { DragAndDropContext } from '@app/components/documents/drag-context';
import { Fields, getFieldNames, getFieldSizes } from '@app/components/documents/new-documents/grid';
import { AttachmentModal } from '@app/components/documents/new-documents/modal/attachment-modal';
import { ArchivingIcon } from '@app/components/documents/new-documents/new-document/archiving-icon';
import { DocumentDate } from '@app/components/documents/new-documents/shared/document-date';
import { DOCUMENT_CLASSES } from '@app/components/documents/styled-components/document';
import { merge } from '@app/functions/classes';
import { AttachmentAccessEnum } from '@app/hooks/dua-access/attachment-access';
import { RENAME_ACCESS_ENUM_TO_TEXT } from '@app/hooks/dua-access/attachment-messages';
import { useAttachmentAccess } from '@app/hooks/dua-access/use-attachment-access';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useLazyGetDocumentsQuery } from '@app/redux-api/oppgaver/queries/documents';
import { DocumentTypeEnum, type IAttachmentDocument, type IParentDocument } from '@app/types/documents/documents';
import { HGrid } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { type HTMLAttributes, memo, type RefObject, useCallback, useContext, useRef, useState } from 'react';
import { DocumentTitle } from './title';

interface Props {
  document: IAttachmentDocument;
  parentDocument: IParentDocument;
}

export const NewAttachment = ({ document, parentDocument }: Props) => {
  const oppgaveId = useOppgaveId();
  const [getDocuments] = useLazyGetDocumentsQuery();
  const cleanDragUI = useRef<() => void>(() => undefined);
  const { setDraggedDocument, clearDragState, draggingEnabled } = useContext(DragAndDropContext);

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
      cleanDragUI={cleanDragUI}
      clearDragState={clearDragState}
      draggingEnabled={draggingEnabled}
      onDragStart={onDragStart}
    />
  );
};

interface NewDocumentInternalProps {
  document: IAttachmentDocument;
  parentDocument: IParentDocument;
  cleanDragUI: RefObject<() => void>;
  clearDragState: () => void;
  draggingEnabled: boolean;
  onDragStart: (e: React.DragEvent<HTMLDivElement>) => void;
}

const NewAttachmentInternal = memo<NewDocumentInternalProps>(
  ({ document, parentDocument, cleanDragUI, clearDragState, draggingEnabled, onDragStart }) => {
    const access = useAttachmentAccess(document, parentDocument);
    const [modalOpen, setModalOpen] = useState(false);
    const isDraggable =
      draggingEnabled &&
      !modalOpen &&
      (access.move === AttachmentAccessEnum.ALLOWED || access.remove === AttachmentAccessEnum.ALLOWED);

    return (
      <StyledNewAttachment
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
        className={DOCUMENT_CLASSES}
      >
        <DocumentTitle
          document={document}
          renameAllowed={access.rename === AttachmentAccessEnum.ALLOWED}
          noRenameAccessMessage={RENAME_ACCESS_ENUM_TO_TEXT[access.rename]}
        />
        {document.type === DocumentTypeEnum.JOURNALFOERT ? (
          <DocumentDate
            data-testid="new-document-date"
            document={document}
            className="truncate"
            style={{ gridArea: Fields.TypeOrDate }}
          />
        ) : null}
        {parentDocument.isMarkertAvsluttet ? (
          <ArchivingIcon dokumentTypeId={document.dokumentTypeId} />
        ) : (
          <AttachmentModal document={document} isOpen={modalOpen} setIsOpen={setModalOpen} access={access} />
        )}
      </StyledNewAttachment>
    );
  },
  (prev, next) => prev.document === next.document && prev.draggingEnabled === next.draggingEnabled,
);

NewAttachmentInternal.displayName = 'NewAttachmentInternal';

interface StlyedNewAttachmentProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  children?: React.ReactNode;
}

export const StyledNewAttachment = ({ children, className, ...props }: StlyedNewAttachmentProps) => (
  <HGrid
    as="article"
    gap="0 2"
    align="center"
    paddingInline="1-alt 0"
    columns={getFieldSizes(EXPANDED_NEW_ATTACHMENT_FIELDS)}
    className={merge(DOCUMENT_CLASSES, className)}
    style={{
      gridTemplateAreas: `"${getFieldNames(EXPANDED_NEW_ATTACHMENT_FIELDS)}"`,
    }}
    {...props}
  >
    {children}
  </HGrid>
);

const EXPANDED_NEW_ATTACHMENT_FIELDS = [Fields.Title, Fields.TypeOrDate, Fields.Action];
