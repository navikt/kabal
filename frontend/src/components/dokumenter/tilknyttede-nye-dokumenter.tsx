import { skipToken } from '@reduxjs/toolkit/dist/query/react';
import NavFrontendSpinner from 'nav-frontend-spinner';
import React, { useContext } from 'react';
import { isoDateTimeToPretty, isoDateTimeToPrettyDate } from '../../domain/date';
import { useOppgave } from '../../hooks/oppgavebehandling/use-oppgave';
import { useIsFullfoert } from '../../hooks/use-is-fullfoert';
import { useOppgaveId } from '../../hooks/use-oppgave-id';
import { DOMAIN, KABAL_OPPGAVEBEHANDLING_PATH } from '../../redux-api/common';
import { useGetSmartEditorQuery } from '../../redux-api/smart-editor';
import { useGetSmartEditorIdQuery } from '../../redux-api/smart-editor-id';
import { ShownDocumentContext } from './context';
import { SmartEditorDocument } from './nye-dokumenter/smart-editor-document';
import { StyledSubHeader, Tilknyttet, TilknyttetDato, TilknyttetKnapp } from './styled-components/minivisning';

export const TilknyttedeNyeDokumenter = () => {
  const oppgaveId = useOppgaveId();
  const { data: oppgavebehandling, isLoading } = useOppgave();
  const isFullfoert = useIsFullfoert();
  const { shownDocument, setShownDocument } = useContext(ShownDocumentContext);
  const { data } = useGetSmartEditorIdQuery(oppgaveId);
  const { data: smartEditorData } = useGetSmartEditorQuery(data?.smartEditorId ?? skipToken);

  if (typeof oppgavebehandling === 'undefined' || isLoading) {
    return <NavFrontendSpinner />;
  }

  const {
    resultat: { file },
  } = oppgavebehandling;

  const url = `${DOMAIN}${KABAL_OPPGAVEBEHANDLING_PATH}/${oppgaveId}/resultat/pdf`;

  const onNewDocumentClick = () => {
    setShownDocument({
      title: file?.name ?? '',
      url,
    });
  };

  const isActive = shownDocument?.url === url;

  return (
    <div>
      {!isFullfoert && <StyledSubHeader>Nye dokumenter</StyledSubHeader>}
      {oppgavebehandling.resultat.file && (
        <Tilknyttet>
          <TilknyttetDato>{isoDateTimeToPretty(oppgavebehandling.resultat.file.opplastet)}</TilknyttetDato>
          <TilknyttetKnapp tilknyttet={true} isActive={isActive} onClick={onNewDocumentClick}>
            {file?.name ?? ''}
          </TilknyttetKnapp>
        </Tilknyttet>
      )}
      <Tilknyttet>
        <TilknyttetDato>{isoDateTimeToPrettyDate(smartEditorData?.modified ?? null)}</TilknyttetDato>
        <SmartEditorDocument oppgaveId={oppgaveId} miniDisplay={true} />
      </Tilknyttet>
    </div>
  );
};
