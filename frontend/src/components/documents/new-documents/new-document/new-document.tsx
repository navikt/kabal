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
import { DOCUMENT_CLASSES } from '@app/components/documents/styled-components/document';
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
import { HGrid } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { memo, useCallback, useContext, useRef, useState } from 'react';
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
    const [modalOpen, setModalOpen] = useState(false);

    const isDraggable = draggingEnabled && canEdit && !containsRolAttachments && !modalOpen;

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
      <HGrid
        as="article"
        gap="0 2"
        align="center"
        paddingInline="1-alt 0"
        columns={getFieldSizes(getGridFields(isExpanded))}
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
        className={DOCUMENT_CLASSES}
        style={{
          gridTemplateAreas: `"${getFieldNames(getGridFields(isExpanded))}"`,
        }}
      >
        <DocumentTitle document={document} />
        {isExpanded ? <SetDocumentType document={document} hasAttachments={hasAttachments} /> : null}
        {document.isMarkertAvsluttet ? (
          <ArchivingIcon dokumentTypeId={document.dokumentTypeId} />
        ) : (
          <DocumentModal
            document={document}
            containsRolAttachments={containsRolAttachments}
            isOpen={modalOpen}
            setIsOpen={setModalOpen}
          />
        )}
      </HGrid>
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
    mottakereEqual(prev.document, next.document) &&
    avsenderEqual(prev.document, next.document),
);

NewDocument.displayName = 'NewDocument';

const getGridFields = (isExpanded: boolean) =>
  isExpanded ? EXPANDED_NEW_DOCUMENT_FIELDS : COLLAPSED_NEW_DOCUMENT_FIELDS;

const hasMottattDato = (doc: IMainDocument): doc is IFileDocument<null> =>
  doc.type === DocumentTypeEnum.UPLOADED && getIsIncomingDocument(doc.dokumentTypeId);

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

const avsenderEqual = (prev: IMainDocument, next: IMainDocument) => {
  const prevIsInngaaende = isAnnenInngaaende(prev);
  const nextIsInngaaende = isAnnenInngaaende(next);

  if (!prevIsInngaaende || !nextIsInngaaende) {
    return prevIsInngaaende === nextIsInngaaende;
  }

  if (prev.avsender !== null && next.avsender !== null) {
    return prev.avsender.identifikator === next.avsender.identifikator;
  }

  return prev.avsender === next.avsender;
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
