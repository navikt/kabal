import React from 'react';
import { IArkivertDocument, IArkivertDocumentVedlegg } from '../../../../types/arkiverte-documents';
import { StyledVedlegg } from '../styled-components/document';
import { DocumentCheckbox } from './document-checkbox';
import { DocumentTitle } from './document-title';

interface Props {
  oppgavebehandlingId: string;
  document: IArkivertDocument;
  vedlegg: IArkivertDocumentVedlegg;
}

export const Attachment = ({ oppgavebehandlingId, vedlegg, document }: Props) => {
  const { journalpostId } = document;
  const { dokumentInfoId, harTilgangTilArkivvariant, tittel } = vedlegg;

  return (
    <StyledVedlegg
      key={journalpostId + dokumentInfoId}
      data-testid="oppgavebehandling-documents-all-list-item"
      data-journalpostid={journalpostId}
      data-dokumentinfoid={dokumentInfoId}
      data-documentname={tittel}
    >
      <DocumentTitle journalpostId={journalpostId} dokumentInfoId={dokumentInfoId} tittel={tittel ?? ''} />
      <DocumentCheckbox
        dokumentInfoId={dokumentInfoId}
        journalpostId={journalpostId}
        harTilgangTilArkivvariant={harTilgangTilArkivvariant}
        title={tittel ?? ''}
        oppgavebehandlingId={oppgavebehandlingId}
        checked={vedlegg.valgt}
      />
    </StyledVedlegg>
  );
};
