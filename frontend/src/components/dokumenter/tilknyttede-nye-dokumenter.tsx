import NavFrontendSpinner from 'nav-frontend-spinner';
import React, { useContext } from 'react';
import { isoDateTimeToPretty } from '../../domain/date';
import { useIsFullfoert } from '../../hooks/use-is-fullfoert';
import { useKlagebehandling } from '../../hooks/use-klagebehandling';
import { useKlagebehandlingId } from '../../hooks/use-klagebehandling-id';
import { baseUrl } from '../../redux-api/common';
import { ShownDocumentContext } from './context';
import { StyledSubHeader, Tilknyttet, TilknyttetDato, TilknyttetKnapp } from './styled-components/minivisning';

export const TilknyttedeNyeDokumenter = () => {
  const klagebehandlingId = useKlagebehandlingId();
  const [klagebehandling, isLoading] = useKlagebehandling();
  const isFullfoert = useIsFullfoert(klagebehandlingId);
  const { shownDocument, setShownDocument } = useContext(ShownDocumentContext);

  if (typeof klagebehandling === 'undefined' || isLoading) {
    return <NavFrontendSpinner />;
  }

  const {
    resultat: { file },
  } = klagebehandling;

  const url = `${baseUrl}api/klagebehandlinger/${klagebehandlingId}/resultat/pdf`;

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
    </div>
  );
};
