import React from 'react';
import { useCanEdit } from '../../../../hooks/use-can-edit';
import { useCheckDocument } from '../../../../hooks/use-check-document';
import { StyledDocumentCheckbox } from './styled-components';

interface Props {
  oppgavebehandlingId: string;
  title: string;
  dokumentInfoId: string;
  journalpostId: string;
  harTilgangTilArkivvariant: boolean;
  valgt: boolean;
  pageReferences: (string | null)[];
  temaer: string[];
}

export const DocumentCheckbox = ({
  oppgavebehandlingId,
  dokumentInfoId,
  journalpostId,
  title,
  harTilgangTilArkivvariant,
  valgt,
  pageReferences,
  temaer,
}: Props): JSX.Element => {
  const [setDocument, isUpdating] = useCheckDocument(
    oppgavebehandlingId,
    dokumentInfoId,
    journalpostId,
    pageReferences,
    temaer
  );
  const canEdit = useCanEdit();

  return (
    <StyledDocumentCheckbox
      title={title}
      disabled={!harTilgangTilArkivvariant || !canEdit || isUpdating}
      checked={valgt}
      onChange={(e) => setDocument(e.currentTarget.checked)}
      data-testid="oppgavebehandling-documents-document-checkbox"
    />
  );
};
