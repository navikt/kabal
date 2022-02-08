import React, { useContext } from 'react';
import { useOppgaveId } from '../../../../hooks/oppgavebehandling/use-oppgave-id';
import { DOMAIN, KABAL_BEHANDLINGER_BASE_PATH } from '../../../../redux-api/common';
import { ShownDocumentContext } from '../../context';
import { ViewDocumentButton } from '../styled-components/document';

interface Props {
  id: string;
  title: string;
}

export const OpenDocumentButton = ({ id, title }: Props) => {
  const oppgaveId = useOppgaveId();
  const { shownDocument, setShownDocument } = useContext(ShownDocumentContext);

  const url = `${DOMAIN}${KABAL_BEHANDLINGER_BASE_PATH}/${oppgaveId}/dokumenter/${id}/pdf`;

  const onClick = () =>
    setShownDocument({
      title,
      url,
    });

  const isActive = shownDocument?.url === url;

  return (
    <ViewDocumentButton isActive={isActive} tilknyttet={true} onClick={onClick}>
      {title}
    </ViewDocumentButton>
  );
};
