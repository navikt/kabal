import { Edit } from '@navikt/ds-icons';
import React, { useState } from 'react';
import styled from 'styled-components';
import { isoDateTimeToPrettyDate } from '../../../../domain/date';
import { useCanEdit } from '../../../../hooks/use-can-edit';
import { IMainDocument } from '../../../../types/documents';
import { StyledDate, StyledDocumentTitle } from '../styled-components/document';
import { DocumentTitle } from './document-title';
import { DocumentTypeOrFrikoble } from './document-type-or-frikoble';

interface Props {
  document: IMainDocument;
}

export const Document = ({ document }: Props) => {
  const [editMode, setEditMode] = useState(false);

  return (
    <>
      <StyledDocumentTitle>
        <DocumentTitle document={document} editMode={editMode} setEditMode={setEditMode} />
        <EditButton isMarkertAvsluttet={document.isMarkertAvsluttet} editMode={editMode} setEditMode={setEditMode} />
      </StyledDocumentTitle>
      <DocumentTypeOrFrikoble document={document} />
      <StyledDate>{isoDateTimeToPrettyDate(document.opplastet)}</StyledDate>
    </>
  );
};

interface EditButtonProps {
  isMarkertAvsluttet: boolean;
  setEditMode: (editMode: boolean) => void;
  editMode: boolean;
}

const EditButton = ({ setEditMode, editMode, isMarkertAvsluttet }: EditButtonProps) => {
  const canEdit = useCanEdit();

  if (!canEdit || isMarkertAvsluttet) {
    return null;
  }

  return (
    <StyledEditButton onClick={() => setEditMode(!editMode)}>
      <Edit />
    </StyledEditButton>
  );
};

const StyledEditButton = styled.button`
  padding-top: 0;
  padding-bottom: 0;
  padding-left: 8px;
  padding-right: 8px;
  margin: 0;
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 14px;
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
