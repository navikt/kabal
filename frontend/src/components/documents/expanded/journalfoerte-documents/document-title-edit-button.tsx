import { Edit, SuccessStroke } from '@navikt/ds-icons';
import React from 'react';
import styled from 'styled-components';
import { useCanEdit } from '../../../../hooks/use-can-edit';
import { StyledDocumentTitle } from '../styled-components/document';

interface Props {
  setEditMode: (editMode: boolean) => void;
  editMode: boolean;
}

export const EditButton = ({ setEditMode, editMode }: Props) => {
  const canEdit = useCanEdit();

  if (!canEdit) {
    return null;
  }

  const Icon = editMode ? StyledSuccessIcon : StyledEditIcon;

  return (
    <StyledEditButton
      onClick={() => setEditMode(!editMode)}
      data-testid="document-title-edit-save-button"
      title="Endre"
    >
      <Icon />
    </StyledEditButton>
  );
};

const StyledEditIcon = styled(Edit)`
  font-size: 14px;
`;

const StyledSuccessIcon = styled(SuccessStroke)`
  font-size: 18px;
`;

const StyledEditButton = styled.button`
  display: flex;
  align-items: center;
  padding-top: 0;
  padding-bottom: 0;
  padding-left: 8px;
  padding-right: 8px;
  margin: 0;
  background-color: transparent;
  border: none;
  cursor: pointer;
  height: 100%;
  align-self: center;
  will-change: transform;
  transition: transform 250ms;

  display: none;

  ${StyledDocumentTitle}:hover & {
    display: block;
  }

  :hover {
    color: var(--a-gray-900);
  }
`;
