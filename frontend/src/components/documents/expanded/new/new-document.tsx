import { EllipsisV } from '@navikt/ds-icons';
import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { useCanEdit } from '../../../../hooks/use-can-edit';
import { useOnClickOutside } from '../../../../hooks/use-on-click-outside';
import { IMainDocument } from '../../../../types/documents';
import { StyledDocument } from '../styled-components/document';
import { Document } from './document';
import { DocumentOptions } from './document-options';
import { StyledToggleExpandButton } from './styled-components';

interface Props {
  document: IMainDocument;
}

export const NewDocument = ({ document }: Props) => (
  <StyledDocument>
    <Document document={document} />
    <ToggleExpandButton document={document}>
      <DocumentOptions document={document} />
    </ToggleExpandButton>
  </StyledDocument>
);

interface ToggleExpandButtonProps {
  document: IMainDocument;
  children: React.ReactNode;
}

const ToggleExpandButton = ({ document, children }: ToggleExpandButtonProps) => {
  const canEdit = useCanEdit();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useOnClickOutside(() => setOpen(false), ref);

  if (!canEdit || document.isMarkertAvsluttet) {
    return null;
  }

  return (
    <DropdownContainer ref={ref}>
      <StyledToggleExpandButton onClick={() => setOpen(!open)}>
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
