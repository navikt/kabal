import { CheckmarkIcon, PencilIcon } from '@navikt/aksel-icons';
import { Button, CopyButton } from '@navikt/ds-react';
import React from 'react';
import { styled } from 'styled-components';
import { useCanEditDocument } from '@app/hooks/use-can-document/use-can-edit-document';
import { DocumentTypeEnum, IMainDocument } from '@app/types/documents/documents';

interface Props {
  document: IMainDocument;
  setEditMode: (editMode: boolean) => void;
  editMode: boolean;
  className?: string;
}

export const TitleAction = ({ setEditMode, editMode, className, document }: Props) => {
  const canEdit = useCanEditDocument(document);
  const canRename = canEdit && document.type !== DocumentTypeEnum.JOURNALFOERT;

  const { tittel } = document;

  if (!canRename) {
    return <CopyButton copyText={tittel} title="Kopier dokumentnavn" size="xsmall" className={className} />;
  }

  const Icon = editMode ? CheckmarkIcon : PencilIcon;

  return (
    <Container className={className}>
      <Button
        onClick={() => setEditMode(!editMode)}
        data-testid="document-title-edit-save-button"
        size="xsmall"
        icon={<Icon aria-hidden />}
        variant="tertiary"
        title="Endre dokumentnavn"
      />
      {editMode ? null : <CopyButton copyText={tittel} title="Kopier dokumentnavn" size="xsmall" />}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  align-items: center;
`;
