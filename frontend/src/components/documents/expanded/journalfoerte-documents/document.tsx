import React, { useContext, useMemo } from 'react';
import { isoDateToPretty } from '../../../../domain/date';
import { useOppgaveId } from '../../../../hooks/oppgavebehandling/use-oppgave-id';
import { useFullTemaNameFromId } from '../../../../hooks/use-kodeverk-ids';
import { DOMAIN, KABAL_OPPGAVEBEHANDLING_PATH } from '../../../../redux-api/common';
import { IArkivertDocument } from '../../../../types/arkiverte-documents';
import { ShownDocumentContext } from '../../context';
import { dokumentMatcher } from '../../helpers';
import { StyledDocumentButton } from '../../styled-components/document-button';
import { StyledDate, StyledDocument, StyledDocumentTitle } from '../styled-components/document';
import { AttachmentList } from './attachment-list';
import { DocumentCheckbox } from './document-checkbox';
import { DocumentTema } from './styled-components';

interface Props {
  document: IArkivertDocument;
}

export const Document = React.memo<Props>(
  ({ document }) => {
    const { dokumentInfoId, journalpostId, tittel, registrert, harTilgangTilArkivvariant, tema } = document;
    const { shownDocument, setShownDocument } = useContext(ShownDocumentContext);
    const oppgaveId = useOppgaveId();

    const url = useMemo(
      () =>
        `${DOMAIN}${KABAL_OPPGAVEBEHANDLING_PATH}/${oppgaveId}/arkivertedokumenter/${journalpostId}/${dokumentInfoId}/pdf`,
      [oppgaveId, journalpostId, dokumentInfoId]
    );

    const onClick = () =>
      setShownDocument({
        title: tittel,
        url,
      });

    const isActive = shownDocument?.url === url;

    return (
      <>
        <StyledDocument>
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
          />
        </StyledDocument>
        <AttachmentList document={document} oppgavebehandlingId={oppgaveId} />
      </>
    );
  },
  (previous, next) => dokumentMatcher(previous.document, next.document)
);

Document.displayName = 'Document';
