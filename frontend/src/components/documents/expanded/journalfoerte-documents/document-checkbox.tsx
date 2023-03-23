import { skipToken } from '@reduxjs/toolkit/dist/query';
import React from 'react';
import { useCanEdit } from '@app/hooks/use-can-edit';
import { useCheckDocument } from '@app/hooks/use-check-document';
import { StyledDocumentCheckbox } from './styled-components';

interface Props {
  oppgavebehandlingId: string | typeof skipToken;
  title: string;
  dokumentInfoId: string;
  journalpostId: string;
  harTilgangTilArkivvariant: boolean;
  checked: boolean;
}

export const DocumentCheckbox = ({
  oppgavebehandlingId,
  dokumentInfoId,
  journalpostId,
  title,
  harTilgangTilArkivvariant,
  checked,
}: Props): JSX.Element | null => {
  const [setDocument, isUpdating] = useCheckDocument(oppgavebehandlingId, dokumentInfoId, journalpostId);
  const canEdit = useCanEdit();

  const disabled = !canEdit || !harTilgangTilArkivvariant || isUpdating || oppgavebehandlingId === skipToken;

  return (
    <StyledDocumentCheckbox
      checked={checked}
      title={title}
      hideLabel
      size="small"
      disabled={disabled}
      onChange={(e) => setDocument(e.currentTarget.checked)}
      data-testid="journalfoert-document-checkbox"
    >
      {title}
    </StyledDocumentCheckbox>
  );
};
