import React, { useMemo } from 'react';
import { IDokument } from '../../../redux-api/dokumenter/types';
import { IKlagebehandling } from '../../../redux-api/oppgave-state-types';
import { IShownDokument } from '../../show-document/types';
import { dokumentMatcher } from '../helpers';
import { VedleggBeholder } from '../styled-components/fullvisning';
import { ITilknyttetVedlegg } from '../types';
import { Vedlegg } from './vedlegg';

interface VedleggListProps {
  klagebehandling: IKlagebehandling;
  dokument: IDokument;
  kanEndre: boolean;
  visDokument: (dokument: IShownDokument) => void;
}

export const VedleggList = React.memo(
  ({ klagebehandling, dokument, kanEndre, visDokument }: VedleggListProps) => {
    const vedleggListe = useMemo<ITilknyttetVedlegg[]>(
      () =>
        dokument.vedlegg.map((vedlegg) => ({
          vedlegg,
          tilknyttet: klagebehandling.tilknyttedeDokumenter.some(
            ({ dokumentInfoId, journalpostId }) =>
              vedlegg.dokumentInfoId === dokumentInfoId && dokument.journalpostId === journalpostId
          ),
        })),
      [dokument.vedlegg, dokument.journalpostId, klagebehandling.tilknyttedeDokumenter]
    );

    if (dokument.vedlegg.length === 0) {
      return null;
    }

    return (
      <VedleggBeholder data-testid={'vedlegg'}>
        {vedleggListe.map(({ vedlegg, tilknyttet }) => (
          <Vedlegg
            key={`vedlegg_${dokument.journalpostId}_${vedlegg.dokumentInfoId}`}
            kanEndre={kanEndre}
            vedlegg={vedlegg}
            dokument={dokument}
            tilknyttet={tilknyttet}
            visDokument={visDokument}
          />
        ))}
      </VedleggBeholder>
    );
  },
  (previous, next) =>
    previous.kanEndre === next.kanEndre &&
    dokumentMatcher(previous.dokument, next.dokument) &&
    previous.klagebehandling.tilknyttedeDokumenter === next.klagebehandling.tilknyttedeDokumenter
);

VedleggList.displayName = 'VedleggList';
