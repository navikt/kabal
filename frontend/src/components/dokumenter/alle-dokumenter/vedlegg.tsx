import React from 'react';
import { IDokument, IDokumentVedlegg } from '../../../redux-api/dokumenter/types';
import { IShownDokument } from '../../show-document/types';
import { dokumentMatcher } from '../helpers';
import {
  DokumentCheckbox,
  DokumentSjekkboks,
  RightAlign,
  VedleggRad,
  VedleggTittel,
} from '../styled-components/fullvisning';

interface VedleggProps {
  dokument: IDokument;
  vedlegg: IDokumentVedlegg;
  tilknyttet: boolean;
  kanEndre: boolean;
  visDokument: (dokument: IShownDokument) => void;
}

export const Vedlegg = React.memo<VedleggProps>(
  ({ vedlegg, dokument, tilknyttet, kanEndre, visDokument }) => {
    // const onCheck = (checked: boolean) => {
    // const d: TilknyttetDokument = {
    //   journalpostId: dokument.journalpostId,
    //   dokumentInfoId: vedlegg.dokumentInfoId,
    // };
    // dispatch(checked ? TILKNYTT_DOKUMENT(d) : FRAKOBLE_DOKUMENT(d));
    // };

    const onVisDokument = () =>
      visDokument({
        journalpostId: dokument.journalpostId,
        dokumentInfoId: vedlegg.dokumentInfoId,
        tittel: vedlegg.tittel,
        harTilgangTilArkivvariant: vedlegg.harTilgangTilArkivvariant,
      });

    return (
      <VedleggRad key={dokument.journalpostId + vedlegg.dokumentInfoId}>
        <VedleggTittel onClick={onVisDokument}>{vedlegg.tittel}</VedleggTittel>
        <DokumentSjekkboks className={'dokument-sjekkboks'}>
          <RightAlign>
            <DokumentCheckbox
              label={''}
              disabled={!vedlegg.harTilgangTilArkivvariant || !kanEndre}
              defaultChecked={tilknyttet}
              // onChange={(e) => onCheck(e.currentTarget.checked)}
            />
          </RightAlign>
        </DokumentSjekkboks>
      </VedleggRad>
    );
  },
  (previous, next) =>
    previous.tilknyttet === next.tilknyttet &&
    previous.kanEndre === next.kanEndre &&
    previous.vedlegg.dokumentInfoId === next.vedlegg.dokumentInfoId &&
    dokumentMatcher(previous.dokument, next.dokument)
);

Vedlegg.displayName = 'Vedlegg';
