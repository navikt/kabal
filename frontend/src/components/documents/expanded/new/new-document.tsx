import { HourglassIcon, MenuElipsisVerticalIcon } from '@navikt/aksel-icons';
import { Modal } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/dist/query/react';
import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import styled from 'styled-components';
import { createDragUI } from '@app/components/documents/create-drag-ui';
import { isoDateTimeToPrettyDate } from '@app/domain/date';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useCanEdit } from '@app/hooks/use-can-edit';
import { useGetDocumentsQuery } from '@app/redux-api/oppgaver/queries/documents';
import { DistribusjonsType, DocumentTypeEnum, IMainDocument } from '@app/types/documents/documents';
import { DragAndDropTypesEnum } from '@app/types/drag-and-drop';
import { StyledDate, StyledNewDocument } from '../styled-components/document';
import { DocumentModalContent } from './document-modal-content';
import { DocumentTitle } from './document-title';
import { SetDocumentType } from './document-type';
import { StyledToggleExpandButton } from './styled-components';

interface Props {
  document: IMainDocument;
}

const EMPTY_LIST: IMainDocument[] = [];

export const NewDocument = ({ document }: Props) => {
  const oppgaveId = useOppgaveId();
  const { data = EMPTY_LIST, isLoading } = useGetDocumentsQuery(oppgaveId);
  const [isDragging, setIsDragging] = useState(false);
  const cleanDragUI = useRef<() => void>(() => undefined);

  const onDragStart = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      setIsDragging(true);
      e.dataTransfer.clearData();

      const format =
        document.type === DocumentTypeEnum.JOURNALFOERT
          ? DragAndDropTypesEnum.JOURNALFOERT_DOCUMENT_REFERENCE
          : DragAndDropTypesEnum.DOCUMENT;

      if (document.parentId === null) {
        const titles: string[] = [document.tittel];

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
      e.dataTransfer.setData(format, document.id);
    },
    [data, document.id, document.parentId, document.tittel, document.type]
  );

  return (
    <StyledNewDocument
      data-documentname={document.tittel}
      data-documentid={document.id}
      data-testid="new-document-list-item-content"
      data-documenttype={document.parentId === null ? 'parent' : 'attachment'}
      onDragStart={onDragStart}
      onDragEnd={() => {
        setIsDragging(false);
        cleanDragUI.current();
      }}
      draggable={!document.isMarkertAvsluttet && !isLoading && !isDragging}
    >
      <DocumentTitle document={document} />
      <SetDocumentType document={document} />
      <StyledDate data-testid="new-document-date">{isoDateTimeToPrettyDate(document.newOpplastet)}</StyledDate>
      <ActionContent document={document} />
    </StyledNewDocument>
  );
};

const ActionContent = ({ document }: Props) => {
  const titleId = useId();

  if (document.isMarkertAvsluttet) {
    if (document.dokumentTypeId === DistribusjonsType.NOTAT) {
      return <StyledIcon title="Dokumentet er under journalføring." data-testid="document-archiving" />;
    }

    return <StyledIcon title="Dokumentet er under journalføring og utsending." data-testid="document-archiving" />;
  }

  return (
    <ToggleExpandButton document={document} titleId={titleId}>
      <DocumentModalContent document={document} titleId={titleId} />
    </ToggleExpandButton>
  );
};

interface ToggleExpandButtonProps {
  document: IMainDocument;
  children: React.ReactNode;
  titleId: string;
}

const ToggleExpandButton = ({ document, titleId, children }: ToggleExpandButtonProps) => {
  const oppgaveId = useOppgaveId();
  const canEdit = useCanEdit();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    Modal.setAppElement('#app');
  }, []);

  if (!canEdit || document.isMarkertAvsluttet) {
    return null;
  }

  const onClick = async () => {
    if (oppgaveId === skipToken) {
      return;
    }
    setOpen(!open);
  };

  return (
    <DropdownContainer>
      <StyledToggleExpandButton onClick={onClick} data-testid="document-actions-button">
        <MenuElipsisVerticalIcon />
      </StyledToggleExpandButton>

      <Modal open={open} aria-modal aria-aria-labelledby={titleId} onClose={() => setOpen(false)}>
        <Modal.Content data-testid="document-actions-modal">{children}</Modal.Content>
      </Modal>
    </DropdownContainer>
  );
};

const DropdownContainer = styled.div`
  display: flex;
  align-items: center;
  grid-area: action;
`;

const StyledIcon = styled(HourglassIcon)`
  grid-area: action;
  justify-self: center;
`;
