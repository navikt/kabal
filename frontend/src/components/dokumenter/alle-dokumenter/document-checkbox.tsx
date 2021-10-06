import NavFrontendSpinner from 'nav-frontend-spinner';
import React from 'react';
import { useCanEdit } from '../../../hooks/use-can-edit';
import { useCheckDocument } from '../../../hooks/use-check-document';
import { DokumentCheckbox } from '../styled-components/fullvisning';

interface DocumentCheckboxProps {
  klagebehandlingId: string;
  title: string;
  dokumentInfoId: string;
  journalpostId: string;
  harTilgangTilArkivvariant: boolean;
  tilknyttet: boolean;
}

export const DocumentCheckbox = ({
  klagebehandlingId,
  dokumentInfoId,
  journalpostId,
  title,
  harTilgangTilArkivvariant,
  tilknyttet,
}: DocumentCheckboxProps): JSX.Element => {
  const [setDocument, isUpdating] = useCheckDocument(klagebehandlingId, dokumentInfoId, journalpostId);
  const canEdit = useCanEdit(klagebehandlingId);

  if (isUpdating) {
    return <NavFrontendSpinner />;
  }

  return (
    <DokumentCheckbox
      label={null}
      title={title}
      disabled={!harTilgangTilArkivvariant || !canEdit || isUpdating}
      defaultChecked={tilknyttet}
      onChange={(e) => setDocument(e.currentTarget.checked)}
    />
  );
};
