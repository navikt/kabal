import { CheckmarkIcon, PencilIcon } from '@navikt/aksel-icons';
import React from 'react';
import styled from 'styled-components';
import { useCanEdit } from '@app/hooks/use-can-edit';
import { StyledDocumentTitle } from '../styled-components/document';

interface Props {
  setEditMode: (editMode: boolean) => void;
  editMode: boolean;
  harTilgangTilArkivvariant: boolean;
}

export const EditButton = ({ setEditMode, editMode, harTilgangTilArkivvariant }: Props) => {
  const canEdit = useCanEdit();

  if (!canEdit || !harTilgangTilArkivvariant) {
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

const StyledEditIcon = styled(PencilIcon)`
  font-size: 14px;
`;

const StyledSuccessIcon = styled(CheckmarkIcon)`
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
