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

export const NyeDokumenter = () => {
  const klagebehandlingId = useKlagebehandlingId();
  const { data: klagebehandling } = useGetKlagebehandlingQuery(klagebehandlingId);
  const isFullfoert = useIsFullfoert(klagebehandlingId);

  if (typeof klagebehandling === 'undefined') {
    return <NavFrontendSpinner />;
  }

  if (isFullfoert && klagebehandling.resultat.file === null) {
    return null;
  }

  return (
    <StyledNyeDokumenter data-testid="klagebehandling-documents-new">
      <ListHeader isFullfoert={isFullfoert} />
      <StyledList data-testid="klagebehandling-documents-new-list">
        {klagebehandling.resultat.file !== null && (
          <NewDocument file={klagebehandling.resultat.file} klagebehandlingId={klagebehandlingId} />
        )}
      </StyledList>
    </StyledNyeDokumenter>
  );
};

interface ListHeaderProps {
  isFullfoert: boolean;
}

const ListHeader = ({ isFullfoert }: ListHeaderProps) => {
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
    <StyledNewDocument data-testid="klagebehandling-documents-new-list-item">
      <DocumentTitle>
        <DocumentButton
          isActive={isActive}
          onClick={onClick}
          data-testid="klagebehandling-documents-open-document-button"
        >
          {file.name}
        </DocumentButton>
      </DocumentTitle>
      <StyledDate>{isoDateTimeToPrettyDate(file.opplastet)}</StyledDate>
      <StyledDeleteButton
        klagebehandlingId={klagebehandlingId}
        data-testid="klagebehandling-documents-new-delete-button"
      />
    </StyledNewDocument>
  );
};
