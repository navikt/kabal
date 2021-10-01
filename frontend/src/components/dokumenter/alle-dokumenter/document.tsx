import React from 'react';
import { formattedDate } from '../../../domene/datofunksjoner';
import { IDokument } from '../../../redux-api/dokumenter/types';
import { IKlagebehandling } from '../../../redux-api/oppgave-state-types';
import { LabelTema } from '../../../styled-components/labels';
import { IShownDokument } from '../../show-document/types';
import { dokumentMatcher } from '../helpers';
import {
  DokumentCheckbox,
  DokumentDato,
  DokumentRad,
  DokumentSjekkboks,
  DokumentTittel,
  RightAlign,
} from '../styled-components/fullvisning';
import { ITilknyttetDokument } from '../types';
import { VedleggList } from './vedlegg-list';

interface DocumentProps extends ITilknyttetDokument {
  klagebehandling: IKlagebehandling;
  canEdit: boolean;
  visDokument: (dokument: IShownDokument) => void;
  onCheck: (document: IDokument, checked: boolean) => void;
}

export const Document = React.memo<DocumentProps>(
  ({ dokument, tilknyttet, canEdit, visDokument, onCheck, klagebehandling }) => {
    const onShowDokument = ({ journalpostId, dokumentInfoId, tittel, harTilgangTilArkivvariant }: IDokument) =>
      visDokument({ journalpostId, dokumentInfoId, tittel, harTilgangTilArkivvariant });

    return (
      <DokumentRad>
        <DokumentTittel onClick={() => onShowDokument(dokument)}>{dokument.tittel}</DokumentTittel>
        <LabelTema>{dokument.tema}</LabelTema>
        <DokumentDato onClick={() => onShowDokument(dokument)} className={'liten'}>
          {formattedDate(dokument.registrert)}
        </DokumentDato>

        <DokumentSjekkboks>
          <RightAlign>
            <DokumentCheckbox
              label={''}
              disabled={!dokument.harTilgangTilArkivvariant || !canEdit}
              defaultChecked={tilknyttet}
              onChange={(e) => onCheck(dokument, e.currentTarget.checked)}
            />
          </RightAlign>
        </DokumentSjekkboks>
        <VedleggList
          dokument={dokument}
          klagebehandling={klagebehandling}
          kanEndre={canEdit}
          visDokument={visDokument}
        />
      </DokumentRad>
    );
  },
  (previous, next) =>
    previous.tilknyttet === next.tilknyttet &&
    previous.canEdit === next.canEdit &&
    dokumentMatcher(previous.dokument, next.dokument)
);

Document.displayName = 'Document';
