import NavFrontendSpinner from 'nav-frontend-spinner';
import React, { useContext } from 'react';
import { isoDateTimeToPrettyDate } from '../../../domain/date';
import { useOppgave } from '../../../hooks/oppgavebehandling/use-oppgave';
import { useOppgavebehandlingApiUrl } from '../../../hooks/oppgavebehandling/use-oppgavebehandling-api-url';
import { useIsFullfoert } from '../../../hooks/use-is-fullfoert';
import { useOppgaveId } from '../../../hooks/use-oppgave-id';
import { baseUrl } from '../../../redux-api/common';
import { IVedlegg } from '../../../types/oppgave-common';
import { ShownDocumentContext } from '../context';
import { DocumentButton } from '../styled-components/document-button';
import { DocumentTitle } from '../styled-components/fullvisning';
import { DeleteDocumentButton } from './delete-document-button';
import { SmartEditorDocument } from './smart-editor-document';
import {
  StyledDate,
  StyledList,
  StyledListHeader,
  StyledNewDocument,
  StyledNyeDokumenter,
  StyledTitle,
  StyledValg,
} from './styled-components';

export const NyeDokumenter = () => {
  const oppgaveId = useOppgaveId();
  const { data: oppgavebehandling } = useOppgave();
  const isFullfoert = useIsFullfoert();

  if (typeof oppgavebehandling === 'undefined') {
    return <NavFrontendSpinner />;
  }

  if (isFullfoert && oppgavebehandling.resultat.file === null) {
    return null;
  }

  return (
    <StyledNyeDokumenter data-testid="klagebehandling-documents-new">
      <ListHeader isFullfoert={isFullfoert} />
      <StyledList data-testid="klagebehandling-documents-new-list">
        {oppgavebehandling.resultat.file && (
          <NewDocument file={oppgavebehandling.resultat.file} oppgaveId={oppgaveId} />
        )}
        <SmartEditorDocument oppgaveId={oppgaveId} />
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
      <StyledTitle>Dokumenter under arbeid</StyledTitle>
      <StyledValg>Valg</StyledValg>
    </StyledListHeader>
  );
};

interface NewDocumentProps {
  file: IVedlegg;
  oppgaveId: string;
}

export const NewDocument = ({ file, oppgaveId }: NewDocumentProps) => {
  const { shownDocument, setShownDocument } = useContext(ShownDocumentContext);
  const oppgavebehandlingUrl = useOppgavebehandlingApiUrl();

  const url = `${baseUrl}${oppgavebehandlingUrl}${oppgaveId}/resultat/pdf`;
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
      <DeleteDocumentButton oppgaveId={oppgaveId} data-testid="klagebehandling-documents-new-delete-button" />
    </StyledNewDocument>
  );
};
