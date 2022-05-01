import React, { useContext } from 'react';
import { DOMAIN, KABAL_OPPGAVEBEHANDLING_PATH } from '../../../../redux-api/common';
import { IArkivertDocument, IArkivertDocumentVedlegg } from '../../../../types/arkiverte-documents';
import { ShownDocumentContext } from '../../context';
import { StyledDocumentButton } from '../../styled-components/document-button';
import { StyledDocument, StyledDocumentTitle } from '../styled-components/document';
import { DocumentCheckbox } from './document-checkbox';

interface Props {
  oppgavebehandlingId: string;
  document: IArkivertDocument;
  vedlegg: IArkivertDocumentVedlegg;
  pageReferences: (string | null)[];
  temaer: string[];
}

export const Attachment = ({ oppgavebehandlingId, vedlegg, document, pageReferences, temaer }: Props) => {
  const url = `${DOMAIN}${KABAL_OPPGAVEBEHANDLING_PATH}/${oppgavebehandlingId}/arkivertedokumenter/${document.journalpostId}/${vedlegg.dokumentInfoId}/pdf`;

  const onClick = () =>
    setShownDocument({
      title: vedlegg.tittel,
      url,
      documentId: null,
    });

  const { shownDocument, setShownDocument } = useContext(ShownDocumentContext);

  const isActive = shownDocument?.url === url;

  return (
    <StyledDocument
      key={document.journalpostId + vedlegg.dokumentInfoId}
      data-testid="oppgavebehandling-documents-all-list-item"
      data-journalpostid={document.journalpostId}
      data-dokumentinfoid={vedlegg.dokumentInfoId}
      data-documentname={vedlegg.tittel}
    >
      <StyledDocumentTitle>
        <StyledDocumentButton
          onClick={onClick}
          isActive={isActive}
          data-testid="oppgavebehandling-documents-open-document-button"
        >
          {vedlegg.tittel}
        </StyledDocumentButton>
      </StyledDocumentTitle>
      <DocumentCheckbox
        dokumentInfoId={vedlegg.dokumentInfoId}
        journalpostId={document.journalpostId}
        harTilgangTilArkivvariant={vedlegg.harTilgangTilArkivvariant}
        title={vedlegg.tittel ?? ''}
        oppgavebehandlingId={oppgavebehandlingId}
        valgt={vedlegg.valgt}
        pageReferences={pageReferences}
        temaer={temaer}
      />
    </StyledDocument>
  );
};
