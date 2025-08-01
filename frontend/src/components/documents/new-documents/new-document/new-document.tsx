import { createDragUI } from '@app/components/documents/create-drag-ui';
import { DragAndDropContext } from '@app/components/documents/drag-context';
import { Fields, getFieldNames, getFieldSizes } from '@app/components/documents/new-documents/grid';
import { DocumentModal } from '@app/components/documents/new-documents/modal/document-modal';
import { ArchivingIcon } from '@app/components/documents/new-documents/new-document/archiving-icon';
import { DOCUMENT_CLASSES } from '@app/components/documents/styled-components/document';
import { areAddressesEqual } from '@app/functions/are-addresses-equal';
import { getIsIncomingDocument } from '@app/functions/is-incoming-document';
import { documentAccessAreEqual } from '@app/hooks/dua-access/diff';
import { DocumentAccessEnum } from '@app/hooks/dua-access/document-access';
import { RENAME_ACCESS_ENUM_TO_TEXT } from '@app/hooks/dua-access/document-messages';
import type { DocumentAccess } from '@app/hooks/dua-access/use-document-access';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useLazyGetDocumentsQuery } from '@app/redux-api/oppgaver/queries/documents';
import {
  DistribusjonsType,
  DocumentTypeEnum,
  type IDocument,
  type IFileDocument,
  type IParentDocument,
} from '@app/types/documents/documents';
import { HGrid } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { memo, useCallback, useContext, useRef, useState } from 'react';
import { DocumentTypeTag, SetDocumentType } from './set-type';
import { DocumentTitle } from './title';

interface Props {
  document: IParentDocument;
  access: DocumentAccess;
}

export const NewDocument = memo(
  ({ document, access }: Props) => {
    const oppgaveId = useOppgaveId();
    const [getDocuments] = useLazyGetDocumentsQuery();
    const cleanDragUI = useRef<() => void>(() => undefined);
    const { setDraggedDocument, clearDragState, draggingEnabled } = useContext(DragAndDropContext);
    const [modalOpen, setModalOpen] = useState(false);

    const isDraggable = draggingEnabled && !modalOpen && access.remove === DocumentAccessEnum.ALLOWED;

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
        columns={getFieldSizes(EXPANDED_NEW_DOCUMENT_FIELDS)}
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
          gridTemplateAreas: `"${getFieldNames(EXPANDED_NEW_DOCUMENT_FIELDS)}"`,
        }}
      >
        <DocumentTitle
          document={document}
          renameAllowed={access.rename === DocumentAccessEnum.ALLOWED}
          noRenameAccessMessage={RENAME_ACCESS_ENUM_TO_TEXT[access.rename]}
        />

        {access.changeType === DocumentAccessEnum.ALLOWED ? (
          <SetDocumentType document={document} />
        ) : (
          <DocumentTypeTag dokumentTypeId={document.dokumentTypeId} />
        )}

        {document.isMarkertAvsluttet ? (
          <ArchivingIcon dokumentTypeId={document.dokumentTypeId} />
        ) : (
          <DocumentModal document={document} isOpen={modalOpen} setIsOpen={setModalOpen} access={access} />
        )}
      </HGrid>
    );
  },
  (prev, next) =>
    prev.document.id === next.document.id &&
    prev.document.tittel === next.document.tittel &&
    prev.document.dokumentTypeId === next.document.dokumentTypeId &&
    prev.document.isMarkertAvsluttet === next.document.isMarkertAvsluttet &&
    prev.document.parentId === next.document.parentId &&
    documentAccessAreEqual(prev.access, next.access) &&
    mottattDatoEqual(prev.document, next.document) &&
    annenInngaaendeEqual(prev.document, next.document) &&
    mottakereEqual(prev.document, next.document) &&
    avsenderEqual(prev.document, next.document),
);

NewDocument.displayName = 'NewDocument';

const EXPANDED_NEW_DOCUMENT_FIELDS = [Fields.Title, Fields.TypeOrDate, Fields.Action];

const hasMottattDato = (doc: IDocument): doc is IFileDocument<null> =>
  doc.type === DocumentTypeEnum.UPLOADED && getIsIncomingDocument(doc.dokumentTypeId);

const mottattDatoEqual = (prev: IDocument, next: IDocument) => {
  if (!(hasMottattDato(prev) && hasMottattDato(next))) {
    return true;
  }

  return prev.datoMottatt === next.datoMottatt;
};

const isAnnenInngaaende = (doc: IDocument): doc is IFileDocument<null> =>
  doc.type === DocumentTypeEnum.UPLOADED && doc.dokumentTypeId === DistribusjonsType.ANNEN_INNGAAENDE_POST;

const annenInngaaendeEqual = (prev: IDocument, next: IDocument) => {
  if (!(isAnnenInngaaende(prev) && isAnnenInngaaende(next))) {
    return true;
  }

  return prev.inngaaendeKanal === next.inngaaendeKanal && prev.avsender?.id === next.avsender?.id;
};

const avsenderEqual = (prev: IDocument, next: IDocument) => {
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

const mottakereEqual = (prev: IDocument, next: IDocument) => {
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
