import React, { useContext, useMemo } from 'react';
import { isoDateToPretty } from '../../../domain/date';
import { useKlagebehandlingId } from '../../../hooks/use-klagebehandling-id';
import { useFullTemaNameFromId } from '../../../hooks/use-kodeverk-ids';
import { baseUrl } from '../../../redux-api/common';
import { IDocument } from '../../../redux-api/documents-types';
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
    const klagebehandlingId = useKlagebehandlingId();

    const url = useMemo(
      () =>
        `${baseUrl}api/klagebehandlinger/${klagebehandlingId}/arkivertedokumenter/${journalpostId}/${dokumentInfoId}/pdf`,
      [klagebehandlingId, journalpostId, dokumentInfoId]
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

        <DocumentTema tema={tema}>{useFullTemaNameFromId(tema)}</DocumentTema>

        <DocumentDate dateTime={registrert}>{isoDateToPretty(registrert)}</DocumentDate>

        <DocumentCheckbox
          dokumentInfoId={dokumentInfoId}
          journalpostId={journalpostId}
          harTilgangTilArkivvariant={harTilgangTilArkivvariant}
          title={tittel ?? ''}
          klagebehandlingId={klagebehandlingId}
        />

        <VedleggList document={document} klagebehandlingId={klagebehandlingId} />
      </DocumentRow>
    );
  },
  (previous, next) => dokumentMatcher(previous.document, next.document)
);

Document.displayName = 'Document';
