import React from 'react';
import { formattedDate } from '../../../domene/datofunksjoner';
import { useFullTemaNameFromId } from '../../../hooks/use-kodeverk-ids';
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
    const onShowDokument = ({ journalpostId, dokumentInfoId, tittel, harTilgangTilArkivvariant }: IDokument) =>
      setShownDocument({ journalpostId, dokumentInfoId, tittel, harTilgangTilArkivvariant });

    return (
      <DocumentRow>
        <DocumentTitle>
          <DocumentButton onClick={() => onShowDokument(document)}>{document.tittel}</DocumentButton>
        </DocumentTitle>

        <DocumentTema tema={document.tema}>{useFullTemaNameFromId(document.tema)}</DocumentTema>

        <DocumentDate dateTime={document.registrert}>{formattedDate(document.registrert)}</DocumentDate>

        <DocumentCheckbox
          dokumentInfoId={document.dokumentInfoId}
          journalpostId={document.journalpostId}
          harTilgangTilArkivvariant={document.harTilgangTilArkivvariant}
          title={document.tittel ?? ''}
          klagebehandlingId={klagebehandlingId}
        />

        <VedleggList document={document} klagebehandlingId={klagebehandlingId} setShownDocument={setShownDocument} />
      </DocumentRow>
    );
  },
  (previous, next) => dokumentMatcher(previous.document, next.document)
);

Document.displayName = 'Document';
