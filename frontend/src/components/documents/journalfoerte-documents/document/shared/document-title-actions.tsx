import { CheckmarkIcon, PencilIcon } from '@navikt/aksel-icons';
import { Button, CopyButton } from '@navikt/ds-react';
import React from 'react';
import { styled } from 'styled-components';
import { StyledDocumentTitle } from '@app/components/documents/journalfoerte-documents/document/shared/document-title-style';

interface ConfirmProps {
  setEditMode: (editMode: boolean) => void;
}

interface Props extends ConfirmProps {
  harTilgangTilArkivvariant: boolean;
  tittel: string;
}

export const ConfirmEditButton = ({ setEditMode }: ConfirmProps) => (
  <Button
    onClick={() => setEditMode(false)}
    icon={<StyledSuccessIcon aria-hidden />}
    data-testid="document-title-edit-save-button"
    title="Endre"
    size="xsmall"
    variant="tertiary"
  />
);

export const DocumentTitleActions = ({ setEditMode, harTilgangTilArkivvariant, tittel }: Props) => {
  if (!harTilgangTilArkivvariant) {
    return null;
  }

  return (
    <Container>
      <Button
        onClick={() => setEditMode(true)}
        icon={<StyledEditIcon aria-hidden />}
        data-testid="document-title-edit-save-button"
        title="Endre"
        size="xsmall"
        variant="tertiary"
      />

      <CopyButton copyText={tittel} title="Kopier dokumentnavn" size="xsmall" />
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
  display: none;
  flex-direction: row;
  align-items: center;

  ${StyledDocumentTitle}:hover & {
    display: flex;
  }
`;
