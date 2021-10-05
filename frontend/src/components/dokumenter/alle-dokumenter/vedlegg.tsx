import React from 'react';
import { IDokument, IDokumentVedlegg } from '../../../redux-api/dokumenter/types';
import { IShownDokument } from '../../show-document/types';
import { dokumentMatcher } from '../helpers';
import { DocumentButton } from '../styled-components/document-button';
import {
  DocumentCheckbox,
  DokumentCheckbox,
  RightAlign,
  VedleggRad,
  VedleggTittel,
} from '../styled-components/fullvisning';

interface VedleggProps {
  document: IDokument;
  vedlegg: IDokumentVedlegg;
  tilknyttet: boolean;
  canEdit: boolean;
  onCheck: (document: IDokument, checked: boolean) => void;
  setShownDocument: (document: IShownDokument) => void;
}

export const Vedlegg = React.memo<VedleggProps>(
  ({ vedlegg, document, tilknyttet, canEdit, onCheck, setShownDocument }) => {
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
        <DocumentCheckbox className={'dokument-sjekkboks'}>
          <RightAlign>
            <DokumentCheckbox
              label={''}
              disabled={!vedlegg.harTilgangTilArkivvariant || !canEdit}
              defaultChecked={tilknyttet}
              onChange={(e) => onCheck({ ...document, ...vedlegg }, e.currentTarget.checked)}
            />
          </RightAlign>
        </DocumentCheckbox>
      </VedleggRad>
    );
  },
  (previous, next) =>
    previous.tilknyttet === next.tilknyttet &&
    previous.canEdit === next.canEdit &&
    previous.vedlegg.dokumentInfoId === next.vedlegg.dokumentInfoId &&
    dokumentMatcher(previous.document, next.document)
);

Vedlegg.displayName = 'Vedlegg';
