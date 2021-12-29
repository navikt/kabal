import React, { useContext } from 'react';
import { useOppgavebehandlingApiUrl } from '../../../hooks/oppgavebehandling/use-oppgavebehandling-api-url';
import { baseUrl } from '../../../redux-api/common';
import { IDocument, IDocumentVedlegg } from '../../../redux-api/documents-types';
import { ShownDocumentContext } from '../context';
import { dokumentMatcher } from '../helpers';
import { DocumentButton } from '../styled-components/document-button';
import { VedleggRow, VedleggTitle } from '../styled-components/fullvisning';
import { DocumentCheckbox } from './document-checkbox';

interface VedleggProps {
  klagebehandlingId: string;
  document: IDocument;
  vedlegg: IDocumentVedlegg;
}

export const Vedlegg = React.memo<VedleggProps>(
  ({ klagebehandlingId, vedlegg, document }) => {
    const oppgavebehandlingUrl = useOppgavebehandlingApiUrl();

    const url = `${baseUrl}${oppgavebehandlingUrl}${klagebehandlingId}/arkivertedokumenter/${document.journalpostId}/${vedlegg.dokumentInfoId}/pdf`;

    const onClick = () =>
      setShownDocument({
        title: vedlegg.tittel,
        url,
      });

    const { shownDocument, setShownDocument } = useContext(ShownDocumentContext);

    const isActive = shownDocument?.url === url;

    return (
      <VedleggRow
        key={document.journalpostId + vedlegg.dokumentInfoId}
        data-testid="klagebehandling-documents-all-list-item"
      >
        <VedleggTitle>
          <DocumentButton
            onClick={onClick}
            isActive={isActive}
            data-testid="klagebehandling-documents-open-document-button"
          >
            {vedlegg.tittel}
          </DocumentButton>
        </VedleggTitle>
        <DocumentCheckbox
          dokumentInfoId={vedlegg.dokumentInfoId}
          journalpostId={document.journalpostId}
          harTilgangTilArkivvariant={vedlegg.harTilgangTilArkivvariant}
          title={vedlegg.tittel ?? ''}
          klagebehandlingId={klagebehandlingId}
        />
      </VedleggRow>
    );
  },
  (previous, next) =>
    previous.vedlegg.dokumentInfoId === next.vedlegg.dokumentInfoId && dokumentMatcher(previous.document, next.document)
);

Vedlegg.displayName = 'Vedlegg';
