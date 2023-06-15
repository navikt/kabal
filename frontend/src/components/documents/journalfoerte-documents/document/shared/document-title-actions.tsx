import { CheckmarkIcon, PencilIcon } from '@navikt/aksel-icons';
import { Button, CopyButton } from '@navikt/ds-react';
import React from 'react';
import styled from 'styled-components';
import { StyledDocumentTitle } from '@app/components/documents/journalfoerte-documents/document/shared/document-title-style';
import { useCanEdit } from '@app/hooks/use-can-edit';

interface Props {
  setEditMode: (editMode: boolean) => void;
  editMode: boolean;
  harTilgangTilArkivvariant: boolean;
  tittel: string;
}

export const DocumentTitleActions = ({ setEditMode, editMode, harTilgangTilArkivvariant, tittel }: Props) => {
  const canEdit = useCanEdit();

  if (!canEdit || !harTilgangTilArkivvariant) {
    return null;
  }

  const Icon = editMode ? StyledSuccessIcon : StyledEditIcon;

  return (
    <Container>
      <Button
        onClick={() => setEditMode(!editMode)}
        icon={<Icon aria-hidden />}
        data-testid="document-title-edit-save-button"
        title="Endre"
        size="small"
        variant="tertiary"
      />
      {editMode ? null : <CopyButton copyText={tittel} title="Kopier dokumentnavn" size="xsmall" />}
    </Container>
  );
};

const StyledEditIcon = styled(PencilIcon)`
  font-size: 20px;
`;

const StyledSuccessIcon = styled(CheckmarkIcon)`
  font-size: 20px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  opacity: 0;
  will-change: opacity;
  transition: opacity 0.2s ease-in-out;

  ${StyledDocumentTitle}:hover & {
    opacity: 1;
  }
`;
