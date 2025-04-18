import { StyledDocumentTitle } from '@app/components/documents/journalfoerte-documents/document/shared/document-title-style';
import { CheckmarkIcon, PencilIcon } from '@navikt/aksel-icons';
import { Button, CopyButton } from '@navikt/ds-react';
import { styled } from 'styled-components';

interface ConfirmProps {
  setEditMode: (editMode: boolean) => void;
}

interface Props extends ConfirmProps {
  hasAccess: boolean;
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

export const DocumentTitleActions = ({ setEditMode, hasAccess, tittel }: Props) => {
  if (!hasAccess) {
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
  font-size: var(--a-spacing-5);
`;

const StyledSuccessIcon = styled(CheckmarkIcon)`
  font-size: var(--a-spacing-5);
`;

const Container = styled.div`
  display: none;
  flex-direction: row;
  align-items: center;

  ${StyledDocumentTitle}:hover & {
    display: flex;
  }
`;
