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
  document: IDokument;
  canEdit: boolean;
  onCheck: (document: IDokument, checked: boolean) => void;
  setShownDocument: (document: IShownDokument) => void;
}

export const VedleggList = React.memo(
  ({ klagebehandling, document, canEdit, onCheck, setShownDocument }: VedleggListProps) => {
    const vedleggListe = useMemo<ITilknyttetVedlegg[]>(
      () =>
        document.vedlegg.map((vedlegg) => ({
          vedlegg,
          tilknyttet: klagebehandling.tilknyttedeDokumenter.some(
            ({ dokumentInfoId, journalpostId }) =>
              vedlegg.dokumentInfoId === dokumentInfoId && document.journalpostId === journalpostId
          ),
        })),
      [document.vedlegg, document.journalpostId, klagebehandling.tilknyttedeDokumenter]
    );

    if (document.vedlegg.length === 0) {
      return null;
    }

    return (
      <VedleggBeholder data-testid={'vedlegg'}>
        {vedleggListe.map(({ vedlegg, tilknyttet }) => (
          <Vedlegg
            key={`vedlegg_${document.journalpostId}_${vedlegg.dokumentInfoId}`}
            canEdit={canEdit}
            vedlegg={vedlegg}
            document={document}
            tilknyttet={tilknyttet}
            onCheck={onCheck}
            setShownDocument={setShownDocument}
          />
        ))}
      </VedleggBeholder>
    );
  },
  (previous, next) =>
    previous.canEdit === next.canEdit &&
    dokumentMatcher(previous.document, next.document) &&
    previous.klagebehandling.tilknyttedeDokumenter === next.klagebehandling.tilknyttedeDokumenter
);

VedleggList.displayName = 'VedleggList';
