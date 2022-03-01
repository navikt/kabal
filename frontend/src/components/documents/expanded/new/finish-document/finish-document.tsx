import { Send } from '@navikt/ds-icons';
import { Hovedknapp } from 'nav-frontend-knapper';
import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { useCanEdit } from '../../../../../hooks/use-can-edit';
import { useOnClickOutside } from '../../../../../hooks/use-on-click-outside';
import { DocumentType, IMainDocument } from '../../../../../types/documents';
import { ConfirmFinishDocument } from './confirm-finish-document';

interface Props {
  document: IMainDocument;
}

export const FinishDocument = ({ document }: Props) => {
  const canEdit = useCanEdit();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const close = () => setIsOpen(false);

  useOnClickOutside(close, ref, false);

  if (!canEdit || document.isMarkertAvsluttet || document.parent !== null) {
    return null;
  }

  const toggleOpen = () => setIsOpen(!isOpen);

  const buttonText = document.dokumentTypeId === DocumentType.NOTAT ? 'Arkiver' : 'Send ut';

  return (
    <StyledSendDocument ref={ref}>
      <StyledSendButton onClick={toggleOpen} kompakt data-testid="document-finish-button">
        <Send /> {buttonText}
      </StyledSendButton>
      <ConfirmFinishDocument isOpen={isOpen} close={() => setIsOpen(false)} document={document} />
    </StyledSendDocument>
  );
};

const StyledSendButton = styled(Hovedknapp)`
  display: flex;
  gap: 8px;
  width: 100%;
`;

const StyledSendDocument = styled.div`
  position: relative;
  width: 100%;
`;
