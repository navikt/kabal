import React, { useContext } from 'react';
import { IArkivertDocument, IArkivertDocumentVedlegg } from '../../../../types/arkiverte-documents';
import { DocumentTypeEnum } from '../../../show-document/types';
import { ShownDocumentContext } from '../../context';
import { StyledDocumentButton } from '../../styled-components/document-button';
import { StyledDocumentTitle, StyledVedlegg } from '../styled-components/document';
import { DocumentCheckbox } from './document-checkbox';

interface Props {
  oppgavebehandlingId: string;
  document: IArkivertDocument;
  vedlegg: IArkivertDocumentVedlegg;
}

export const Attachment = ({ oppgavebehandlingId, vedlegg, document }: Props) => {
  const { shownDocument, setShownDocument } = useContext(ShownDocumentContext);

  const { journalpostId } = document;
  const { dokumentInfoId, harTilgangTilArkivvariant, tittel } = vedlegg;

  const onClick = () =>
    setShownDocument({
      title: document.tittel ?? 'Ingen tittel',
      dokumentInfoId,
      journalpostId,
      type: DocumentTypeEnum.ARCHIVED,
    });

  const isActive =
    shownDocument !== null &&
    shownDocument.type === DocumentTypeEnum.ARCHIVED &&
    shownDocument.dokumentInfoId === dokumentInfoId &&
    shownDocument.journalpostId === journalpostId;

  return (
    <StyledVedlegg
      key={journalpostId + dokumentInfoId}
      data-testid="oppgavebehandling-documents-all-list-item"
      data-journalpostid={journalpostId}
      data-dokumentinfoid={dokumentInfoId}
      data-documentname={tittel}
    >
      <StyledDocumentTitle>
        <StyledDocumentButton
          onClick={onClick}
          isActive={isActive}
          data-testid="oppgavebehandling-documents-open-document-button"
          disabled={!harTilgangTilArkivvariant}
          title={harTilgangTilArkivvariant ? undefined : 'Du har ikke tilgang til å se dette dokumentet.'}
        >
          {tittel}
        </StyledDocumentButton>
      </StyledDocumentTitle>
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
