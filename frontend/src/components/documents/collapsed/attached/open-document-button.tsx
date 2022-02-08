import React, { useContext } from 'react';
import { useOppgaveId } from '../../../../hooks/oppgavebehandling/use-oppgave-id';
import { DOMAIN, KABAL_OPPGAVEBEHANDLING_PATH } from '../../../../redux-api/common';
import { ShownDocumentContext } from '../../context';
import { ViewDocumentButton } from '../styled-components/document';

interface Props {
  title: string;
  journalpostId: string;
  dokumentInfoId: string;
  tilknyttet?: boolean;
}

export const OpenDocumentButton = ({ dokumentInfoId, journalpostId, title, tilknyttet = true }: Props) => {
  const oppgaveId = useOppgaveId();
  const { shownDocument, setShownDocument } = useContext(ShownDocumentContext);

  const url = `${DOMAIN}${KABAL_OPPGAVEBEHANDLING_PATH}/${oppgaveId}/arkivertedokumenter/${journalpostId}/${dokumentInfoId}/pdf`;

  const onClick = () =>
    setShownDocument({
      title,
      url,
    });

  const isActive = shownDocument?.url === url;

  return (
    <ViewDocumentButton isActive={isActive} tilknyttet={tilknyttet} onClick={onClick}>
      {title}
    </ViewDocumentButton>
  );
};
