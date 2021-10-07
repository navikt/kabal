import React from 'react';
import { IDokument } from '../../../redux-api/dokumenter/types';
import { IShownDokument } from '../../show-document/types';
import { dokumentMatcher } from '../helpers';
import { VedleggBeholder } from '../styled-components/fullvisning';
import { Vedlegg } from './vedlegg';

interface VedleggListProps {
  klagebehandlingId: string;
  document: IDokument;
  setShownDocument: (document: IShownDokument) => void;
}

export const VedleggList = React.memo(
  ({ klagebehandlingId, document, setShownDocument }: VedleggListProps) => {
    if (document.vedlegg.length === 0) {
      return null;
    }

    return (
      <VedleggBeholder data-testid={'vedlegg'}>
        {document.vedlegg.map((vedlegg) => (
          <Vedlegg
            key={`vedlegg_${document.journalpostId}_${vedlegg.dokumentInfoId}`}
            klagebehandlingId={klagebehandlingId}
            vedlegg={vedlegg}
            document={document}
            setShownDocument={setShownDocument}
          />
        ))}
      </VedleggBeholder>
    );
  },
  (previous, next) => dokumentMatcher(previous.document, next.document)
);

VedleggList.displayName = 'VedleggList';
