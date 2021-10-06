import React from 'react';
import { IDokument, IDokumentVedlegg } from '../../../redux-api/dokumenter/types';
import { IShownDokument } from '../../show-document/types';
import { dokumentMatcher } from '../helpers';
import { DocumentButton } from '../styled-components/document-button';
import { StyledDocumentCheckbox, VedleggRad, VedleggTittel } from '../styled-components/fullvisning';

interface VedleggProps {
  klagebehandlingId: string;
  document: IDokument;
  vedlegg: IDokumentVedlegg;
  tilknyttet: boolean;
  setShownDocument: (document: IShownDokument) => void;
}

export const Vedlegg = React.memo<VedleggProps>(
  ({ klagebehandlingId, vedlegg, document, tilknyttet, setShownDocument }) => {
    const onShowDocument = () =>
      setShownDocument({
        journalpostId: document.journalpostId,
        dokumentInfoId: vedlegg.dokumentInfoId,
        tittel: vedlegg.tittel,
        harTilgangTilArkivvariant: vedlegg.harTilgangTilArkivvariant,
      });

    return (
      <VedleggRad key={document.journalpostId + vedlegg.dokumentInfoId}>
        <VedleggTittel>
          <DocumentButton onClick={onShowDocument}>{vedlegg.tittel}</DocumentButton>
        </VedleggTittel>
        <StyledDocumentCheckbox
          dokumentInfoId={vedlegg.dokumentInfoId}
          journalpostId={document.journalpostId}
          harTilgangTilArkivvariant={vedlegg.harTilgangTilArkivvariant}
          title={vedlegg.tittel ?? ''}
          tilknyttet={tilknyttet}
          klagebehandlingId={klagebehandlingId}
        />
      </VedleggRad>
    );
  },
  (previous, next) =>
    previous.tilknyttet === next.tilknyttet &&
    previous.vedlegg.dokumentInfoId === next.vedlegg.dokumentInfoId &&
    dokumentMatcher(previous.document, next.document)
);

Vedlegg.displayName = 'Vedlegg';
