import { Edit, SuccessStroke } from '@navikt/ds-icons';
import React from 'react';
import styled from 'styled-components';
import { useCanEdit } from '../../../../hooks/use-can-edit';

interface Props {
  isMarkertAvsluttet: boolean;
  setEditMode: (editMode: boolean) => void;
  editMode: boolean;
}

export const EditButton = ({ setEditMode, editMode, isMarkertAvsluttet }: Props) => {
  const canEdit = useCanEdit();

  if (!canEdit || isMarkertAvsluttet) {
    return null;
  }

  const Icon = editMode ? StyledSuccessIcon : StyledEditIcon;

  return (
    <StyledEditButton onClick={() => setEditMode(!editMode)}>
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
  transform: scale(1);

  :hover {
    color: #0067c5;
    transform: scale(1.25);
  }
`;
