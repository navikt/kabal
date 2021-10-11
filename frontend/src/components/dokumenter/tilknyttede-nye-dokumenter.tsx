import NavFrontendSpinner from 'nav-frontend-spinner';
import React from 'react';
import { isoDateTimeToPretty } from '../../domain/date';
import { useKlagebehandling } from '../../hooks/use-klagebehandling';
import { useKlagebehandlingId } from '../../hooks/use-klagebehandling-id';
import { baseUrl } from '../../redux-api/common';
import { IShownDokument } from '../show-document/types';
import { StyledSubHeader, Tilknyttet, TilknyttetDato, TilknyttetKnapp } from './styled-components/minivisning';

interface TilknyttedeNyeDokumenterProps {
  setShownDocument: (document: IShownDokument) => void;
}

export const TilknyttedeNyeDokumenter = ({ setShownDocument }: TilknyttedeNyeDokumenterProps) => {
  const klagebehandlingId = useKlagebehandlingId();
  const [klagebehandling, isLoading] = useKlagebehandling();

  if (typeof klagebehandling === 'undefined' || isLoading) {
    return <NavFrontendSpinner />;
  }

  const {
    resultat: { file },
  } = klagebehandling;

  const onNewDocumentClick = () => {
    setShownDocument({
      title: file?.name ?? '',
      url: `${baseUrl}api/klagebehandlinger/${klagebehandlingId}/resultat/pdf`,
    });
  };

  return (
    <div>
      <StyledSubHeader>Nye dokumenter</StyledSubHeader>
      {klagebehandling.resultat.file && (
        <Tilknyttet>
          <TilknyttetDato>{isoDateTimeToPretty(klagebehandling.resultat.file.opplastet)}</TilknyttetDato>
          <TilknyttetKnapp tilknyttet={true} onClick={onNewDocumentClick}>
            {file?.name ?? ''}
          </TilknyttetKnapp>
        </Tilknyttet>
      )}
    </div>
  );
};
