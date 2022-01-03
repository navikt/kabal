import React, { useContext, useMemo } from 'react';
import { isoDateToPretty } from '../../../domain/date';
import { useOppgavebehandlingApiUrl } from '../../../hooks/oppgavebehandling/use-oppgavebehandling-api-url';
import { useFullTemaNameFromId } from '../../../hooks/use-kodeverk-ids';
import { useOppgaveId } from '../../../hooks/use-oppgave-id';
import { baseUrl } from '../../../redux-api/common';
import { IDocument } from '../../../types/documents';
import { ShownDocumentContext } from '../context';
import { dokumentMatcher } from '../helpers';
import { DocumentButton } from '../styled-components/document-button';
import { DocumentDate, DocumentRow, DocumentTema, DocumentTitle } from '../styled-components/fullvisning';
import { DocumentCheckbox } from './document-checkbox';
import { VedleggList } from './vedlegg-list';

interface DocumentProps {
  document: IDocument;
}

export const Document = React.memo<DocumentProps>(
  ({ document }) => {
    const { dokumentInfoId, journalpostId, tittel, registrert, harTilgangTilArkivvariant, tema } = document;
    const { shownDocument, setShownDocument } = useContext(ShownDocumentContext);
    const oppgaveId = useOppgaveId();
    const oppgavebehandlingUrl = useOppgavebehandlingApiUrl();

    const url = useMemo(
      () => `${baseUrl}${oppgavebehandlingUrl}${oppgaveId}/arkivertedokumenter/${journalpostId}/${dokumentInfoId}/pdf`,
      [oppgaveId, oppgavebehandlingUrl, journalpostId, dokumentInfoId]
    );

    const onClick = () =>
      setShownDocument({
        title: tittel,
        url,
      });

    const isActive = shownDocument?.url === url;

    return (
      <DocumentRow>
        <DocumentTitle>
          <DocumentButton
            isActive={isActive}
            onClick={onClick}
            data-testid="klagebehandling-documents-open-document-button"
          >
            {tittel}
          </DocumentButton>
        </DocumentTitle>

        <DocumentTema>{useFullTemaNameFromId(tema)}</DocumentTema>

        <DocumentDate dateTime={registrert}>{isoDateToPretty(registrert)}</DocumentDate>

        <DocumentCheckbox
          dokumentInfoId={dokumentInfoId}
          journalpostId={journalpostId}
          harTilgangTilArkivvariant={harTilgangTilArkivvariant}
          title={tittel ?? ''}
          klagebehandlingId={oppgaveId}
        />

        <VedleggList document={document} klagebehandlingId={oppgaveId} />
      </DocumentRow>
    );
  },
  (previous, next) => dokumentMatcher(previous.document, next.document)
);

Document.displayName = 'Document';
