import { CheckmarkIcon, PencilIcon } from '@navikt/aksel-icons';
import { Button, CopyButton } from '@navikt/ds-react';
import React from 'react';
import styled from 'styled-components';
import { useCanEdit } from '@app/hooks/use-can-edit';
import { DocumentTypeEnum } from '@app/types/documents/documents';

interface Props {
  isMarkertAvsluttet: boolean;
  setEditMode: (editMode: boolean) => void;
  editMode: boolean;
  type: DocumentTypeEnum;
  title: string;
  className?: string;
}

export const TitleAction = ({ setEditMode, editMode, isMarkertAvsluttet, type, title, className }: Props) => {
  const canEdit = useCanEdit();

  if (!canEdit || isMarkertAvsluttet || type === DocumentTypeEnum.JOURNALFOERT) {
    return <CopyButton copyText={title} title="Kopier dokumentnavn" size="xsmall" className={className} />;
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
      {editMode ? null : <CopyButton copyText={title} title="Kopier dokumentnavn" size="xsmall" />}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  align-items: center;
`;
