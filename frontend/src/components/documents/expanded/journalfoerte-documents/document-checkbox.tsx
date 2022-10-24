import { skipToken } from '@reduxjs/toolkit/dist/query';
import React from 'react';
import { useCanEdit } from '../../../../hooks/use-can-edit';
import { useCheckDocument } from '../../../../hooks/use-check-document';
import { StyledDocumentCheckbox } from './styled-components';

interface Props {
  oppgavebehandlingId: string | typeof skipToken;
  title: string;
  dokumentInfoId: string;
  journalpostId: string;
  harTilgangTilArkivvariant: boolean;
  valgt: boolean;
}

export const DocumentCheckbox = ({
  oppgavebehandlingId,
  dokumentInfoId,
  journalpostId,
  title,
  harTilgangTilArkivvariant,
  valgt,
}: Props): JSX.Element | null => {
  const [setDocument, isUpdating] = useCheckDocument(oppgavebehandlingId, dokumentInfoId, journalpostId);
  const canEdit = useCanEdit();

  if (!canEdit) {
    return null;
  }

  return (
    <StyledDocumentCheckbox
      title={title}
      disabled={!harTilgangTilArkivvariant || isUpdating || oppgavebehandlingId === skipToken}
      checked={valgt}
      onChange={(e) => setDocument(e.currentTarget.checked)}
      data-testid="journalfoert-document-checkbox"
    />
  );
};
