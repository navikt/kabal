import React from 'react';
import { formattedDate } from '../../../domene/datofunksjoner';
import { useFullTemaNameFromId } from '../../../hooks/use-kodeverk-ids';
import { IDokument } from '../../../redux-api/dokumenter/types';
import { IKlagebehandling } from '../../../redux-api/oppgave-state-types';
import { IShownDokument } from '../../show-document/types';
import { dokumentMatcher } from '../helpers';
import { DocumentButton } from '../styled-components/document-button';
import {
  DocumentDate,
  DocumentRow,
  DocumentTema,
  DocumentTitle,
  StyledDocumentCheckbox,
} from '../styled-components/fullvisning';
import { ITilknyttetDokument } from '../types';
import { VedleggList } from './vedlegg-list';

interface DocumentProps extends ITilknyttetDokument {
  klagebehandling: IKlagebehandling;
  setShownDocument: (document: IShownDokument) => void;
}

export const Document = React.memo<DocumentProps>(
  ({ document, tilknyttet, setShownDocument, klagebehandling }) => {
    const onShowDokument = ({ journalpostId, dokumentInfoId, tittel, harTilgangTilArkivvariant }: IDokument) =>
      setShownDocument({ journalpostId, dokumentInfoId, tittel, harTilgangTilArkivvariant });

    return (
      <DocumentRow>
        <DocumentTitle>
          <DocumentButton onClick={() => onShowDokument(document)}>{document.tittel}</DocumentButton>
        </DocumentTitle>

        <DocumentTema tema={document.tema}>{useFullTemaNameFromId(document.tema)}</DocumentTema>

        <DocumentDate dateTime={document.registrert}>{formattedDate(document.registrert)}</DocumentDate>

        <StyledDocumentCheckbox
          dokumentInfoId={document.dokumentInfoId}
          journalpostId={document.journalpostId}
          harTilgangTilArkivvariant={document.harTilgangTilArkivvariant}
          title={document.tittel ?? ''}
          tilknyttet={tilknyttet}
          klagebehandlingId={klagebehandling.id}
        />

        <VedleggList document={document} klagebehandling={klagebehandling} setShownDocument={setShownDocument} />
      </DocumentRow>
    );
  },
  (previous, next) => previous.tilknyttet === next.tilknyttet && dokumentMatcher(previous.document, next.document)
);

Document.displayName = 'Document';
