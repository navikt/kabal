import { createDragUI } from '@app/components/documents/create-drag-ui';
import { DragAndDropContext } from '@app/components/documents/drag-context';
import {
  COLLAPSED_NEW_DOCUMENT_FIELDS,
  EXPANDED_NEW_DOCUMENT_FIELDS,
  getFieldNames,
  getFieldSizes,
} from '@app/components/documents/new-documents/grid';
import { DocumentModal } from '@app/components/documents/new-documents/modal/modal';
import { ArchivingIcon } from '@app/components/documents/new-documents/new-document/archiving-icon';
import { documentCSS } from '@app/components/documents/styled-components/document';
import { useIsExpanded } from '@app/components/documents/use-is-expanded';
import { areAddressesEqual } from '@app/functions/are-addresses-equal';
import { getIsIncomingDocument } from '@app/functions/is-incoming-document';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useCanEditDocument } from '@app/hooks/use-can-document/use-can-edit-document';
import { useLazyGetDocumentsQuery } from '@app/redux-api/oppgaver/queries/documents';
import {
  DistribusjonsType,
  DocumentTypeEnum,
  type IFileDocument,
  type IMainDocument,
} from '@app/types/documents/documents';
import { skipToken } from '@reduxjs/toolkit/query';
import { memo, useCallback, useContext, useRef } from 'react';
import { styled } from 'styled-components';
import { SetDocumentType } from './set-type';
import { DocumentTitle } from './title';

interface Props {
  document: IMainDocument;
  hasAttachments: boolean;
  containsRolAttachments: boolean;
}

export const NewDocument = memo(
  ({ document, containsRolAttachments, hasAttachments }: Props) => {
    const oppgaveId = useOppgaveId();
    const [getDocuments] = useLazyGetDocumentsQuery();
    const [isExpanded] = useIsExpanded();
    const cleanDragUI = useRef<() => void>(() => undefined);
    const { setDraggedDocument, clearDragState, draggingEnabled } = useContext(DragAndDropContext);
    const canEdit = useCanEditDocument(document);

    const isDraggable = draggingEnabled && canEdit && !containsRolAttachments;

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
      <StyledNewDocument
        $isExpanded={isExpanded}
        data-documentname={document.tittel}
        data-documentid={document.id}
        data-testid="new-document-list-item-content"
        data-documenttype="parent"
        onDragStart={isDraggable ? onDragStart : (e) => e.preventDefault()}
        onDragEnd={() => {
          cleanDragUI.current();
          clearDragState();
        }}
        draggable={isDraggable}
      >
        <DocumentTitle document={document} />
        {isExpanded ? <SetDocumentType document={document} hasAttachments={hasAttachments} /> : null}
        {document.isMarkertAvsluttet ? (
          <ArchivingIcon dokumentTypeId={document.dokumentTypeId} />
        ) : (
          <DocumentModal document={document} containsRolAttachments={containsRolAttachments} />
        )}
      </StyledNewDocument>
    );
  },
  (prev, next) =>
    prev.hasAttachments === next.hasAttachments &&
    prev.containsRolAttachments === next.containsRolAttachments &&
    prev.document.id === next.document.id &&
    prev.document.tittel === next.document.tittel &&
    prev.document.dokumentTypeId === next.document.dokumentTypeId &&
    prev.document.isMarkertAvsluttet === next.document.isMarkertAvsluttet &&
    prev.document.parentId === next.document.parentId &&
    mottattDatoEqual(prev.document, next.document) &&
    annenInngaaendeEqual(prev.document, next.document) &&
    mottakereEqual(prev.document, next.document),
);

NewDocument.displayName = 'NewDocument';

const getGridFields = ({ $isExpanded }: StlyedNewDocumentProps) =>
  $isExpanded ? EXPANDED_NEW_DOCUMENT_FIELDS : COLLAPSED_NEW_DOCUMENT_FIELDS;

interface StlyedNewDocumentProps {
  $isExpanded: boolean;
}

const StyledNewDocument = styled.article<StlyedNewDocumentProps>`
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

const hasMottattDato = (doc: IMainDocument): doc is IFileDocument<null> =>
  doc.type === DocumentTypeEnum.UPLOADED && getIsIncomingDocument(doc);

const mottattDatoEqual = (prev: IMainDocument, next: IMainDocument) => {
  if (!(hasMottattDato(prev) && hasMottattDato(next))) {
    return true;
  }

  return prev.datoMottatt === next.datoMottatt;
};

const isAnnenInngaaende = (doc: IMainDocument): doc is IFileDocument<null> =>
  doc.type === DocumentTypeEnum.UPLOADED && doc.dokumentTypeId === DistribusjonsType.ANNEN_INNGAAENDE_POST;

const annenInngaaendeEqual = (prev: IMainDocument, next: IMainDocument) => {
  if (!(isAnnenInngaaende(prev) && isAnnenInngaaende(next))) {
    return true;
  }

  return prev.inngaaendeKanal === next.inngaaendeKanal && prev.avsender?.id === next.avsender?.id;
};

const mottakereEqual = (prev: IMainDocument, next: IMainDocument) => {
  if (prev.mottakerList.length !== next.mottakerList.length) {
    return false;
  }

  for (let i = 0; i < prev.mottakerList.length; i++) {
    const p = prev.mottakerList[i];
    const n = next.mottakerList[i];

    if (p === undefined || n === undefined) {
      return false;
    }

    if (p.part.id !== n.part.id || p.handling !== n.handling) {
      return false;
    }

    if (p.overriddenAddress === null || n.overriddenAddress === null) {
      if (n.overriddenAddress !== p.overriddenAddress) {
        return false;
      }
    } else if (!areAddressesEqual(p.overriddenAddress, n.overriddenAddress)) {
      return false;
    }
  }

  return true;
};
