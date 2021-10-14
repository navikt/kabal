import React, { useMemo } from 'react';
import { useCanEdit } from '../../../hooks/use-can-edit';
import { useCheckDocument } from '../../../hooks/use-check-document';
import { useGetKlagebehandlingQuery } from '../../../redux-api/oppgave';
import { dokumentMatcher } from '../helpers';
import { StyledDocumentCheckbox } from '../styled-components/fullvisning';

interface DocumentCheckboxProps {
  klagebehandlingId: string;
  title: string;
  dokumentInfoId: string;
  journalpostId: string;
  harTilgangTilArkivvariant: boolean;
}

export const DocumentCheckbox = ({
  klagebehandlingId,
  dokumentInfoId,
  journalpostId,
  title,
  harTilgangTilArkivvariant,
}: DocumentCheckboxProps): JSX.Element => {
  const { data: klagebehandling } = useGetKlagebehandlingQuery(klagebehandlingId);
  const [setDocument, isUpdating] = useCheckDocument(klagebehandlingId, dokumentInfoId, journalpostId);
  const canEdit = useCanEdit(klagebehandlingId);

  const tilknyttet = useMemo<boolean>(
    () =>
      klagebehandling?.tilknyttedeDokumenter.some((t) => dokumentMatcher(t, { dokumentInfoId, journalpostId })) ??
      false,
    [klagebehandling, dokumentInfoId, journalpostId]
  );

  return (
    <StyledDocumentCheckbox
      title={title}
      disabled={!harTilgangTilArkivvariant || !canEdit || isUpdating}
      checked={tilknyttet}
      onChange={(e) => setDocument(e.currentTarget.checked)}
    />
  );
};
