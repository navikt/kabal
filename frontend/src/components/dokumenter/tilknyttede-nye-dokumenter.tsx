import { skipToken } from '@reduxjs/toolkit/dist/query/react';
import NavFrontendSpinner from 'nav-frontend-spinner';
import React, { useContext } from 'react';
import { isoDateTimeToPretty, isoDateTimeToPrettyDate } from '../../domain/date';
import { useIsFullfoert } from '../../hooks/use-is-fullfoert';
import { useKlagebehandling } from '../../hooks/use-klagebehandling';
import { useKlagebehandlingId } from '../../hooks/use-klagebehandling-id';
import { baseUrl } from '../../redux-api/common';
import { useGetSmartEditorQuery } from '../../redux-api/smart-editor';
import { useGetSmartEditorIdQuery } from '../../redux-api/smart-editor-id';
import { ShownDocumentContext } from './context';
import { SmartEditorDocument } from './nye-dokumenter/smart-editor-document';
import { StyledSubHeader, Tilknyttet, TilknyttetDato, TilknyttetKnapp } from './styled-components/minivisning';

export const TilknyttedeNyeDokumenter = () => {
  const klagebehandlingId = useKlagebehandlingId();
  const [klagebehandling, isLoading] = useKlagebehandling();
  const isFullfoert = useIsFullfoert(klagebehandlingId);
  const { shownDocument, setShownDocument } = useContext(ShownDocumentContext);
  const { data } = useGetSmartEditorIdQuery(klagebehandlingId);
  const { data: smartEditorData } = useGetSmartEditorQuery(data?.smartEditorId ?? skipToken);

  if (typeof klagebehandling === 'undefined' || isLoading) {
    return <NavFrontendSpinner />;
  }

  const {
    resultat: { file },
  } = klagebehandling;

  const url = `${baseUrl}api/kabal-api/klagebehandlinger/${klagebehandlingId}/resultat/pdf`;

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
      {klagebehandling.resultat.file && (
        <Tilknyttet>
          <TilknyttetDato>{isoDateTimeToPretty(klagebehandling.resultat.file.opplastet)}</TilknyttetDato>
          <TilknyttetKnapp tilknyttet={true} isActive={isActive} onClick={onNewDocumentClick}>
            {file?.name ?? ''}
          </TilknyttetKnapp>
        </Tilknyttet>
      )}
      <Tilknyttet>
        <TilknyttetDato>{isoDateTimeToPrettyDate(smartEditorData?.modified ?? null)}</TilknyttetDato>
        <SmartEditorDocument klagebehandlingId={klagebehandlingId} miniDisplay={true} />
      </Tilknyttet>
    </div>
  );
};
