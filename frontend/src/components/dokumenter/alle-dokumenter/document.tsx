import React from 'react';
import { formattedDate } from '../../../domene/datofunksjoner';
import { useFullTemaNameFromId } from '../../../hooks/use-kodeverk-ids';
import { baseUrl } from '../../../redux-api/common';
import { IDokument } from '../../../redux-api/dokumenter/types';
import { IShownDokument } from '../../show-document/types';
import { dokumentMatcher } from '../helpers';
import { DocumentButton } from '../styled-components/document-button';
import { DocumentDate, DocumentRow, DocumentTema, DocumentTitle } from '../styled-components/fullvisning';
import { DocumentCheckbox } from './document-checkbox';
import { VedleggList } from './vedlegg-list';

interface DocumentProps {
  klagebehandlingId: string;
  document: IDokument;
  setShownDocument: (document: IShownDokument) => void;
}

export const Document = React.memo<DocumentProps>(
  ({ document, setShownDocument, klagebehandlingId }) => {
    const { dokumentInfoId, journalpostId, tittel, registrert, harTilgangTilArkivvariant, tema } = document;

    const onClick = () =>
      setShownDocument({
        title: tittel,
        url: `${baseUrl}api/klagebehandlinger/${klagebehandlingId}/arkivertedokumenter/${journalpostId}/${dokumentInfoId}/pdf`,
      });

    return (
      <DocumentRow>
        <DocumentTitle>
          <DocumentButton onClick={onClick}>{tittel}</DocumentButton>
        </DocumentTitle>

        <DocumentTema tema={tema}>{useFullTemaNameFromId(tema)}</DocumentTema>

        <DocumentDate dateTime={registrert}>{formattedDate(registrert)}</DocumentDate>

        <DocumentCheckbox
          dokumentInfoId={dokumentInfoId}
          journalpostId={journalpostId}
          harTilgangTilArkivvariant={harTilgangTilArkivvariant}
          title={tittel ?? ''}
          klagebehandlingId={klagebehandlingId}
        />

        <VedleggList document={document} klagebehandlingId={klagebehandlingId} setShownDocument={setShownDocument} />
      </DocumentRow>
    );
  },
  (previous, next) => dokumentMatcher(previous.document, next.document)
);

Document.displayName = 'Document';
