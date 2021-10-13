import NavFrontendSpinner from 'nav-frontend-spinner';
import React from 'react';
import styled from 'styled-components';
import { isoDateTimeToPrettyDate } from '../../../domain/date';
import { useIsFullfoert } from '../../../hooks/use-is-fullfoert';
import { useKlagebehandlingId } from '../../../hooks/use-klagebehandling-id';
import { baseUrl } from '../../../redux-api/common';
import { useGetKlagebehandlingQuery } from '../../../redux-api/oppgave';
import { IVedlegg } from '../../../redux-api/oppgave-state-types';
import { IShownDokument } from '../../show-document/types';
import { DocumentButton } from '../styled-components/document-button';
import { DocumentTitle } from '../styled-components/fullvisning';
import { DeleteDocumentButton } from './delete-document-button';

export const StyledListHeader = styled.div`
  display: grid;
  grid-template-columns: auto 10em 5em 5em;
  grid-column-gap: 1em;
  border-bottom: 1px solid #c6c2bf;
  padding-bottom: 1em;
`;

export const StyledValg = styled.h2`
  font-size: 1em;
  margin: 0;
  grid-column: 4;
  text-align: right;
`;

export const StyledTitle = styled.h2`
  margin: 0;
  font-size: 1em;
  grid-column: 1;
`;

export const StyledNyeDokumenter = styled.div`
  padding: 1em;
`;

export const StyledNewDocument = styled.li`
  display: grid;
  grid-template-columns: 350px 140px 5em 32px;
  grid-template-areas: 'title type date options';
  grid-column-gap: 1em;
`;

export const StyledList = styled.ul`
  padding: 0;
  list-style-type: none;
`;

export const StyledFilename = styled.h1`
  grid-area: title;
  font-size: 1em;
  color: inherit;
  margin: 0;
  padding: 0;
`;

export const StyledDate = styled.time`
  grid-area: date;
  font-size: 12px;
  text-align: center;
`;

export const StyledDeleteButton = styled(DeleteDocumentButton)`
  grid-area: options;
  cursor: pointer;
  background-color: transparent;
  border: none;
  border-radius: 0;
  padding: 0;
  color: #0067c5;
  text-decoration: underline;
  text-align: right;

  &:disabled {
    cursor: not-allowed;
  }
`;

interface NyeDokumenterProps {
  setShownDocument: (document: IShownDokument) => void;
  show: boolean;
}

export const NyeDokumenter = ({ setShownDocument, show }: NyeDokumenterProps) => {
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
          <NewDocument
            file={klagebehandling.resultat.file}
            klagebehandlingId={klagebehandlingId}
            setShownDocument={setShownDocument}
          />
        )}
      </StyledList>
    </StyledNyeDokumenter>
  );
};

interface NewDocumentProps {
  file: IVedlegg;
  klagebehandlingId: string;
  setShownDocument: (document: IShownDokument) => void;
}

export const NewDocument = ({ file, klagebehandlingId, setShownDocument }: NewDocumentProps) => {
  const onClick = () =>
    setShownDocument({
      title: file.name,
      url: `${baseUrl}api/klagebehandlinger/${klagebehandlingId}/resultat/pdf`,
    });

  return (
    <StyledNewDocument>
      <DocumentTitle>
        <DocumentButton onClick={onClick}>{file.name}</DocumentButton>
      </DocumentTitle>
      <StyledDate>{isoDateTimeToPrettyDate(file.opplastet)}</StyledDate>
      <StyledDeleteButton klagebehandlingId={klagebehandlingId} />
    </StyledNewDocument>
  );
};
