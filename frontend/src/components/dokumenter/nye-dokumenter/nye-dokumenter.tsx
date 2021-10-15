import NavFrontendSpinner from 'nav-frontend-spinner';
import React, { useContext } from 'react';
import { isoDateTimeToPrettyDate } from '../../../domain/date';
import { useIsFullfoert } from '../../../hooks/use-is-fullfoert';
import { useKlagebehandlingId } from '../../../hooks/use-klagebehandling-id';
import { baseUrl } from '../../../redux-api/common';
import { useGetKlagebehandlingQuery } from '../../../redux-api/oppgave';
import { IVedlegg } from '../../../redux-api/oppgave-state-types';
import { ShownDocumentContext } from '../context';
import { DocumentButton } from '../styled-components/document-button';
import { DocumentTitle } from '../styled-components/fullvisning';
import {
  StyledDate,
  StyledDeleteButton,
  StyledList,
  StyledListHeader,
  StyledNewDocument,
  StyledNyeDokumenter,
  StyledTitle,
  StyledValg,
} from './styled-components';

interface NyeDokumenterProps {
  show: boolean;
}

export const NyeDokumenter = ({ show }: NyeDokumenterProps) => {
  const klagebehandlingId = useKlagebehandlingId();
  const { data: klagebehandling } = useGetKlagebehandlingQuery(klagebehandlingId);
  const isFullfoert = useIsFullfoert(klagebehandlingId);

  if (!show) {
    return null;
  }

  if (typeof klagebehandling === 'undefined') {
    return <NavFrontendSpinner />;
  }

  const ListHeader = () => {
    if (isFullfoert) {
      return null;
    }

    return (
      <StyledListHeader>
        <StyledTitle>Nye dokumenter</StyledTitle>
        <StyledValg>Valg</StyledValg>
      </StyledListHeader>
    );
  };

  if (isFullfoert && klagebehandling.resultat.file === null) {
    return null;
  }

  return (
    <StyledNyeDokumenter>
      <ListHeader />
      <StyledList>
        {klagebehandling.resultat.file !== null && (
          <NewDocument file={klagebehandling.resultat.file} klagebehandlingId={klagebehandlingId} />
        )}
      </StyledList>
    </StyledNyeDokumenter>
  );
};

interface NewDocumentProps {
  file: IVedlegg;
  klagebehandlingId: string;
}

export const NewDocument = ({ file, klagebehandlingId }: NewDocumentProps) => {
  const { shownDocument, setShownDocument } = useContext(ShownDocumentContext);

  const url = `${baseUrl}api/klagebehandlinger/${klagebehandlingId}/resultat/pdf`;
  const onClick = () =>
    setShownDocument({
      title: file.name,
      url,
    });

  const isActive = shownDocument?.url === url;

  return (
    <StyledNewDocument>
      <DocumentTitle>
        <DocumentButton isActive={isActive} onClick={onClick}>
          {file.name}
        </DocumentButton>
      </DocumentTitle>
      <StyledDate>{isoDateTimeToPrettyDate(file.opplastet)}</StyledDate>
      <StyledDeleteButton klagebehandlingId={klagebehandlingId} />
    </StyledNewDocument>
  );
};
