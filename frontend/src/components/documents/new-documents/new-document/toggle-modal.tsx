import { HourglassIcon, MenuElipsisVerticalIcon } from '@navikt/aksel-icons';
import { Modal } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/dist/query/react';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Fields } from '@app/components/documents/new-documents/grid';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useCanEdit } from '@app/hooks/use-can-edit';
import { DistribusjonsType, IMainDocument } from '@app/types/documents/documents';

interface Props {
  document: IMainDocument;
  children: React.ReactNode;
  titleId: string;
}

export const ToggleModalButton = ({ document, titleId, children }: Props) => {
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
        <Icon {...document} />
      </StyledToggleExpandButton>

      <Modal
        open={open}
        aria-modal
        aria-aria-labelledby={titleId}
        onClose={() => setOpen(false)}
        shouldCloseOnEsc={false}
        shouldCloseOnOverlayClick={true}
      >
        <Modal.Content data-testid="document-actions-modal">{children}</Modal.Content>
      </Modal>
    </DropdownContainer>
  );
};

const Icon = ({ isMarkertAvsluttet, dokumentTypeId }: IMainDocument) => {
  if (isMarkertAvsluttet) {
    if (dokumentTypeId === DistribusjonsType.NOTAT) {
      return <HourglassIcon title="Dokumentet er under journalføring." data-testid="document-archiving" />;
    }

    return <HourglassIcon title="Dokumentet er under journalføring og utsending." data-testid="document-archiving" />;
  }

  return <MenuElipsisVerticalIcon />;
};

const DropdownContainer = styled.div`
  display: flex;
  align-items: center;
  grid-area: ${Fields.Action};
`;

const StyledToggleExpandButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background-color: transparent;
  border: none;
  border-radius: 0;
  height: 100%;
  line-height: 1;
  font-size: 20px;
  padding: 0;
  width: 100%;
`;
