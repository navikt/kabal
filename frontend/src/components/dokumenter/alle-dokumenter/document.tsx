import React from 'react';
import { formattedDate } from '../../../domene/datofunksjoner';
import { useFullTemaNameFromId } from '../../../hooks/use-kodeverk-ids';
import { IDokument } from '../../../redux-api/dokumenter/types';
import { IKlagebehandling } from '../../../redux-api/oppgave-state-types';
import { IShownDokument } from '../../show-document/types';
import { dokumentMatcher } from '../helpers';
import { DocumentButton } from '../styled-components/document-button';
import {
  DocumentCheckbox,
  DocumentDate,
  DocumentRow,
  DocumentTema,
  DocumentTitle,
  DokumentCheckbox,
} from '../styled-components/fullvisning';
import { ITilknyttetDokument } from '../types';
import { VedleggList } from './vedlegg-list';

interface DocumentProps extends ITilknyttetDokument {
  klagebehandling: IKlagebehandling;
  canEdit: boolean;
  setShownDocument: (document: IShownDokument) => void;
  onCheck: (document: IDokument, checked: boolean) => void;
}

export const Document = React.memo<DocumentProps>(
  ({ document, tilknyttet, canEdit, setShownDocument, onCheck, klagebehandling }) => {
    const onShowDokument = ({ journalpostId, dokumentInfoId, tittel, harTilgangTilArkivvariant }: IDokument) =>
      setShownDocument({ journalpostId, dokumentInfoId, tittel, harTilgangTilArkivvariant });

    return (
      <DocumentRow>
        <DocumentTitle>
          <DocumentButton onClick={() => onShowDokument(document)}>{document.tittel}</DocumentButton>
        </DocumentTitle>
        <DocumentTema tema={document.tema}>{useFullTemaNameFromId(document.tema)}</DocumentTema>
        <DocumentDate dateTime={document.registrert} className={'liten'}>
          {formattedDate(document.registrert)}
        </DocumentDate>

        <DocumentCheckbox>
          <DokumentCheckbox
            label={''}
            disabled={!document.harTilgangTilArkivvariant || !canEdit}
            defaultChecked={tilknyttet}
            onChange={(e) => onCheck(document, e.currentTarget.checked)}
          />
        </DocumentCheckbox>
        <VedleggList
          document={document}
          klagebehandling={klagebehandling}
          canEdit={canEdit}
          onCheck={onCheck}
          setShownDocument={setShownDocument}
        />
      </DocumentRow>
    );
  },
  (previous, next) =>
    previous.tilknyttet === next.tilknyttet &&
    previous.canEdit === next.canEdit &&
    dokumentMatcher(previous.document, next.document)
);

Document.displayName = 'Document';
