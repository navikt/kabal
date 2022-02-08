import React, { useMemo } from 'react';
import { useOppgave } from '../../../../hooks/oppgavebehandling/use-oppgave';
import { useCanEdit } from '../../../../hooks/use-can-edit';
import { useCheckDocument } from '../../../../hooks/use-check-document';
import { dokumentMatcher } from '../../helpers';
import { StyledDocumentCheckbox } from './styled-components';

interface Props {
  oppgavebehandlingId: string;
  title: string;
  dokumentInfoId: string;
  journalpostId: string;
  harTilgangTilArkivvariant: boolean;
}

export const DocumentCheckbox = ({
  oppgavebehandlingId,
  dokumentInfoId,
  journalpostId,
  title,
  harTilgangTilArkivvariant,
}: Props): JSX.Element => {
  const { data: oppgave } = useOppgave();
  const [setDocument, isUpdating] = useCheckDocument(oppgavebehandlingId, dokumentInfoId, journalpostId);
  const canEdit = useCanEdit();

  const tilknyttet = useMemo<boolean>(
    () => oppgave?.tilknyttedeDokumenter.some((t) => dokumentMatcher(t, { dokumentInfoId, journalpostId })) ?? false,
    [oppgave, dokumentInfoId, journalpostId]
  );

  return (
    <StyledDocumentCheckbox
      title={title}
      disabled={!harTilgangTilArkivvariant || !canEdit || isUpdating}
      checked={tilknyttet}
      onChange={(e) => setDocument(e.currentTarget.checked)}
      data-testid="oppgavebehandling-documents-document-checkbox"
    />
  );
};
