import { EllipsisV, Sandglass } from '@navikt/ds-icons';
import { skipToken } from '@reduxjs/toolkit/dist/query/react';
import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { isoDateTimeToPrettyDate } from '../../../../domain/date';
import { useOppgaveId } from '../../../../hooks/oppgavebehandling/use-oppgave-id';
import { useCanEdit } from '../../../../hooks/use-can-edit';
import { useOnClickOutside } from '../../../../hooks/use-on-click-outside';
import { DocumentType, IMainDocument } from '../../../../types/documents/documents';
import { StyledDate, StyledNewDocument } from '../styled-components/document';
import { DocumentOptions } from './document-options';
import { DocumentTitle } from './document-title';
import { SetDocumentType } from './document-type';
import { StyledToggleExpandButton } from './styled-components';

interface Props {
  document: IMainDocument;
}

export const NewDocument = ({ document }: Props) => (
  <StyledNewDocument
    data-documentname={document.tittel}
    data-documentid={document.id}
    data-testid="new-document-list-item-content"
    data-documenttype={document.parent === null ? 'parent' : 'attachment'}
  >
    <DocumentTitle document={document} />
    <SetDocumentType document={document} />
    <StyledDate data-testid="new-document-date">{isoDateTimeToPrettyDate(document.opplastet)}</StyledDate>
    <ActionContent document={document} />
  </StyledNewDocument>
);

const ActionContent = ({ document }: Props) => {
  if (document.isMarkertAvsluttet) {
    if (document.dokumentTypeId === DocumentType.NOTAT) {
      return <StyledIcon title="Dokumentet er under journalføring." data-testid="document-archiving" />;
    }

    return <StyledIcon title="Dokumentet er under journalføring og utsending." data-testid="document-archiving" />;
  }

  return (
    <ToggleExpandButton document={document}>
      <DocumentOptions document={document} />
    </ToggleExpandButton>
  );
};

interface ToggleExpandButtonProps {
  document: IMainDocument;
  children: React.ReactNode;
}

const ToggleExpandButton = ({ document, children }: ToggleExpandButtonProps) => {
  const oppgaveId = useOppgaveId();
  const canEdit = useCanEdit();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useOnClickOutside(() => setOpen(false), ref);

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
    <DropdownContainer ref={ref}>
      <StyledToggleExpandButton onClick={onClick} data-testid="document-actions-button">
        <EllipsisV />
      </StyledToggleExpandButton>
      {open ? children : null}
    </DropdownContainer>
  );
};

const DropdownContainer = styled.div`
  display: flex;
  align-items: center;
  grid-area: action;
`;

const StyledIcon = styled(Sandglass)`
  grid-area: action;
  justify-self: center;
`;
