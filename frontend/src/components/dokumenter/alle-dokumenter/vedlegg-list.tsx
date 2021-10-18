import React from 'react';
import { IDocument } from '../../../redux-api/documents-types';
import { dokumentMatcher } from '../helpers';
import { VedleggContainer } from '../styled-components/fullvisning';
import { Vedlegg } from './vedlegg';

interface VedleggListProps {
  klagebehandlingId: string;
  document: IDocument;
}

export const VedleggList = React.memo(
  ({ klagebehandlingId, document }: VedleggListProps) => {
    if (document.vedlegg.length === 0) {
      return null;
    }

    return (
      <VedleggContainer data-testid="klagebehandling-documents-all-vedlegg-list">
        {document.vedlegg.map((vedlegg) => (
          <Vedlegg
            key={`vedlegg_${document.journalpostId}_${vedlegg.dokumentInfoId}`}
            klagebehandlingId={klagebehandlingId}
            vedlegg={vedlegg}
            document={document}
          />
        ))}
      </VedleggContainer>
    );
  },
  (previous, next) => dokumentMatcher(previous.document, next.document)
);

VedleggList.displayName = 'VedleggList';
