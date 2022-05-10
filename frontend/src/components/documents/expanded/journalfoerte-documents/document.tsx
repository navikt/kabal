import React, { useContext } from 'react';
import { isoDateToPretty } from '../../../../domain/date';
import { useOppgaveId } from '../../../../hooks/oppgavebehandling/use-oppgave-id';
import { useFullTemaNameFromId } from '../../../../hooks/use-kodeverk-ids';
import { IArkivertDocument } from '../../../../types/arkiverte-documents';
import { DocumentTypeEnum } from '../../../show-document/types';
import { ShownDocumentContext } from '../../context';
import { StyledDocumentButton } from '../../styled-components/document-button';
import { StyledDate, StyledDocument, StyledDocumentTitle } from '../styled-components/document';
import { AttachmentList } from './attachment-list';
import { DocumentCheckbox } from './document-checkbox';
import { DocumentTema } from './styled-components';

interface Props {
  document: IArkivertDocument;
  pageReferences: (string | null)[];
  temaer: string[];
}

export const Document = ({ document, pageReferences, temaer }: Props) => {
  const { shownDocument, setShownDocument } = useContext(ShownDocumentContext);
  const oppgaveId = useOppgaveId();

  const { dokumentInfoId, journalpostId, tittel, registrert, harTilgangTilArkivvariant, tema, valgt } = document;

  const onClick = () =>
    setShownDocument({
      title: tittel ?? 'Ingen tittel',
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
    <>
      <StyledDocument
        data-testid="document-jounalfoert"
        data-journalpostid={journalpostId}
        data-dokumentinfoid={dokumentInfoId}
        data-documentname={tittel}
      >
        <StyledDocumentTitle>
          <StyledDocumentButton
            isActive={isActive}
            onClick={onClick}
            data-testid="oppgavebehandling-documents-open-document-button"
          >
            {tittel}
          </StyledDocumentButton>
        </StyledDocumentTitle>
        <DocumentTema>{useFullTemaNameFromId(tema)}</DocumentTema>
        <StyledDate dateTime={registrert}>{isoDateToPretty(registrert)}</StyledDate>
        <DocumentCheckbox
          dokumentInfoId={dokumentInfoId}
          journalpostId={journalpostId}
          harTilgangTilArkivvariant={harTilgangTilArkivvariant}
          title={tittel ?? ''}
          oppgavebehandlingId={oppgaveId}
          valgt={valgt}
          pageReferences={pageReferences}
          temaer={temaer}
        />
      </StyledDocument>
      <AttachmentList document={document} oppgaveId={oppgaveId} pageReferences={pageReferences} temaer={temaer} />
    </>
  );
};
