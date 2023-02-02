import { Collapse, Expand } from '@navikt/ds-icons';
import { Button, Detail, Label } from '@navikt/ds-react';
import { CopyToClipboard } from '@navikt/ds-react-internal';
import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { isoDateToPretty } from '../../../../domain/date';
import { useOppgaveId } from '../../../../hooks/oppgavebehandling/use-oppgave-id';
import { useFullTemaNameFromId } from '../../../../hooks/use-kodeverk-ids';
import { IArkivertDocument } from '../../../../types/arkiverte-documents';
import { DocumentTypeEnum } from '../../../show-document/types';
import { ShownDocumentContext } from '../../context';
import { EllipsisTitle, StyledDocumentButton } from '../../styled-components/document-button';
import { StyledDate, StyledDocumentTitle, StyledJournalfoertDocument } from '../styled-components/document';
import { ClickableField, Fields, StyledClickableField } from '../styled-components/grid';
import { AttachmentList } from './attachment-list';
import { formatAvsenderMottaker } from './avsender-mottaker';
import { DocumentCheckbox } from './document-checkbox';
import { JournalposttypeTag } from './journalposttype';
import { DocumentTema } from './styled-components';

interface Props {
  document: IArkivertDocument;
  setAvsenderMottaker: (avsenderMottaker: string) => void;
  setSaksId: (saksId: string) => void;
  setTema: (tema: string) => void;
}

export const Document = ({ document, setAvsenderMottaker, setTema, setSaksId }: Props) => {
  const { shownDocument, setShownDocument } = useContext(ShownDocumentContext);
  const oppgaveId = useOppgaveId();
  const [expanded, setExpanded] = useState(false);

  const {
    dokumentInfoId,
    journalpostId,
    tittel,
    registrert,
    harTilgangTilArkivvariant,
    tema,
    valgt,
    avsenderMottaker,
    sak,
    journalposttype,
    kanalnavn,
    opprettetAvNavn,
    journalstatus,
  } = document;

  const temaName = useFullTemaNameFromId(tema);

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

  const toggleExpanded = () => setExpanded(!expanded);
  const Icon = expanded ? Collapse : Expand;

  return (
    <>
      <StyledJournalfoertDocument
        $expanded={expanded}
        data-testid="document-jounalfoert"
        data-journalpostid={journalpostId}
        data-dokumentinfoid={dokumentInfoId}
        data-documentname={tittel}
      >
        <ExpandButton variant="tertiary" size="small" icon={<Icon aria-hidden />} onClick={toggleExpanded} />
        <StyledDocumentTitle>
          <StyledDocumentButton
            isActive={isActive}
            onClick={onClick}
            data-testid="oppgavebehandling-documents-open-document-button"
            disabled={!harTilgangTilArkivvariant}
            title={harTilgangTilArkivvariant ? undefined : 'Du har ikke tilgang til å se dette dokumentet.'}
          >
            <EllipsisTitle>{tittel}</EllipsisTitle>
          </StyledDocumentButton>
        </StyledDocumentTitle>
        <DocumentTema
          as={StyledClickableField}
          $area={Fields.Meta}
          size="small"
          variant="tertiary"
          onClick={() => setTema(tema ?? 'UNKNOWN')}
          title={temaName}
        >
          {temaName}
        </DocumentTema>
        <StyledDate dateTime={registrert}>{isoDateToPretty(registrert)}</StyledDate>
        <ClickableField
          $area={Fields.AvsenderMottaker}
          onClick={() => setAvsenderMottaker(avsenderMottaker === null ? 'NONE' : avsenderMottaker.id ?? 'UNKNOWN')}
        >
          {formatAvsenderMottaker(avsenderMottaker)}
        </ClickableField>
        <ClickableField $area={Fields.SaksId} onClick={() => setSaksId(sak?.fagsakId ?? 'NONE')}>
          {sak?.fagsakId ?? 'Ingen'}
        </ClickableField>
        <JournalposttypeTag type={journalposttype} />
        <DocumentCheckbox
          dokumentInfoId={dokumentInfoId}
          journalpostId={journalpostId}
          harTilgangTilArkivvariant={harTilgangTilArkivvariant}
          title={tittel ?? ''}
          oppgavebehandlingId={oppgaveId}
          checked={valgt}
        />
      </StyledJournalfoertDocument>
      <ExpandedDocument
        show={expanded}
        journalstatus={journalstatus}
        kanalnavn={kanalnavn}
        journalpostId={journalpostId}
        opprettetAvNavn={opprettetAvNavn}
      />
      <AttachmentList document={document} oppgaveId={oppgaveId} />
    </>
  );
};

interface ExpandedDocumentProps
  extends Pick<IArkivertDocument, 'journalstatus' | 'journalpostId' | 'kanalnavn' | 'opprettetAvNavn'> {
  show: boolean;
}

const ExpandedDocument = ({
  journalstatus,
  kanalnavn,
  opprettetAvNavn,
  journalpostId,
  show,
}: ExpandedDocumentProps) => {
  if (!show) {
    return null;
  }

  return (
    <StyledExpandedDocument>
      <span>
        <Label size="small">Status</Label>
        <Detail>{journalstatus}</Detail>
      </span>

      <span>
        <Label size="small">Utsendingskanal</Label>
        <Detail>{kanalnavn}</Detail>
      </span>

      <span>
        <Label size="small">Journalpost opprettet av</Label>
        <Detail>{opprettetAvNavn}</Detail>
      </span>

      <span>
        <Label size="small">Journalpost-ID</Label>
        <Detail>
          <CopyToClipboard copyText={journalpostId} popoverText="Kopiert!" size="xsmall">
            {journalpostId}
          </CopyToClipboard>
        </Detail>
      </span>
    </StyledExpandedDocument>
  );
};

const StyledExpandedDocument = styled.div`
  display: flex;
  padding: 8px;
  column-gap: 32px;
  border-bottom: 1px solid var(--a-border-default);
  background-color: var(--a-surface-subtle);
`;

const ExpandButton = styled(Button)`
  grid-area: expand;
`;
