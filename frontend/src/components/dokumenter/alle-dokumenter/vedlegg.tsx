import React from 'react';
import { IDokument, IDokumentVedlegg } from '../../../redux-api/dokumenter/types';
import { IShownDokument } from '../../show-document/types';
import { dokumentMatcher } from '../helpers';
import { DocumentButton } from '../styled-components/document-button';
import { VedleggRow, VedleggTitle } from '../styled-components/fullvisning';
import { DocumentCheckbox } from './document-checkbox';

interface VedleggProps {
  klagebehandlingId: string;
  document: IDokument;
  vedlegg: IDokumentVedlegg;
  setShownDocument: (document: IShownDokument) => void;
}

export const Vedlegg = React.memo<VedleggProps>(
  ({ klagebehandlingId, vedlegg, document, setShownDocument }) => {
    const onShowDocument = () =>
      setShownDocument({
        journalpostId: document.journalpostId,
        dokumentInfoId: vedlegg.dokumentInfoId,
        tittel: vedlegg.tittel,
        harTilgangTilArkivvariant: vedlegg.harTilgangTilArkivvariant,
      });

    return (
      <VedleggRow key={document.journalpostId + vedlegg.dokumentInfoId}>
        <VedleggTitle>
          <DocumentButton onClick={onShowDocument}>{vedlegg.tittel}</DocumentButton>
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
