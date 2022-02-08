import NavFrontendSpinner from 'nav-frontend-spinner';
import React, { useContext } from 'react';
import { isoDateTimeToPrettyDate } from '../../../domain/date';
import { useOppgave } from '../../../hooks/oppgavebehandling/use-oppgave';
import { useOppgaveId } from '../../../hooks/oppgavebehandling/use-oppgave-id';
import { useIsFullfoert } from '../../../hooks/use-is-fullfoert';
import { DOMAIN, KABAL_OPPGAVEBEHANDLING_PATH } from '../../../redux-api/common';
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
  const { data: oppgave } = useOppgave();
  const isFullfoert = useIsFullfoert();

  if (typeof oppgave === 'undefined') {
    return <NavFrontendSpinner />;
  }

  if (isFullfoert && oppgave.resultat.file === null) {
    return null;
  }

  return (
    <StyledNyeDokumenter data-testid="klagebehandling-documents-new">
      <ListHeader isFullfoert={isFullfoert} />
      <StyledList data-testid="klagebehandling-documents-new-list">
        {oppgave.resultat.file && <NewDocument file={oppgave.resultat.file} oppgaveId={oppgaveId} />}
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

  const url = `${DOMAIN}${KABAL_OPPGAVEBEHANDLING_PATH}/${oppgaveId}/resultat/pdf`;
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
