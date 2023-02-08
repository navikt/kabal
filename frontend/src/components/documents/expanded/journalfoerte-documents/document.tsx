import { Collapse, Expand } from '@navikt/ds-icons';
import { Button } from '@navikt/ds-react';
import React, { useState } from 'react';
import styled from 'styled-components';
import { isoDateToPretty } from '../../../../domain/date';
import { useOppgaveId } from '../../../../hooks/oppgavebehandling/use-oppgave-id';
import { useFullTemaNameFromId } from '../../../../hooks/use-kodeverk-ids';
import { IArkivertDocument, Journalposttype, Kanal, RelevantDatotype } from '../../../../types/arkiverte-documents';
import { StyledDate, StyledJournalfoertDocument } from '../styled-components/document';
import { ClickableField, Fields, StyledClickableField } from '../styled-components/grid';
import { AttachmentList } from './attachment-list';
import { formatAvsenderMottaker } from './avsender-mottaker';
import { DocumentCheckbox } from './document-checkbox';
import { DocumentTitle } from './document-title';
import { ExpandedDocument } from './expanded-document';
import { JournalposttypeTag } from './journalposttype';
import { DocumentTema } from './styled-components';

interface Props {
  document: IArkivertDocument;
  setAvsenderMottaker: (avsenderMottaker: string) => void;
  setSaksId: (saksId: string) => void;
  setTema: (tema: string) => void;
}

export const Document = ({ document, setAvsenderMottaker, setTema, setSaksId }: Props) => {
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
  } = document;

  const temaName = useFullTemaNameFromId(tema);

  const toggleExpanded = () => setExpanded(!expanded);
  const Icon = expanded ? Collapse : Expand;

  return (
    <>
      <StyledJournalfoertDocument
        $expanded={expanded}
        data-testid="document-journalfoert"
        data-journalpostid={journalpostId}
        data-dokumentinfoid={dokumentInfoId}
        data-documentname={tittel}
      >
        <ExpandButton variant="tertiary" size="small" icon={<Icon aria-hidden />} onClick={toggleExpanded} />
        <DocumentTitle journalpostId={journalpostId} dokumentInfoId={dokumentInfoId} tittel={tittel ?? ''} />
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
        <AvsenderMottaker
          journalposttype={journalposttype}
          avsenderMottaker={avsenderMottaker}
          setAvsenderMottaker={setAvsenderMottaker}
        />
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
        document={{
          ...document,
          kanal: Kanal.SDP,
          kanalnavn: 'Digital postkasse til innbyggere',
          relevanteDatoer: [
            { dato: '2022-11-10T14:49:36', datotype: RelevantDatotype.DATO_DOKUMENT },
            { dato: '2022-11-10T14:49:36', datotype: RelevantDatotype.DATO_JOURNALFOERT },
            { dato: '2022-11-10T14:49:37', datotype: RelevantDatotype.DATO_EKSPEDERT },
          ],
        }}
      />
      <AttachmentList document={document} oppgaveId={oppgaveId} />
    </>
  );
};

interface AvsenderMottakerProps extends Pick<IArkivertDocument, 'journalposttype' | 'avsenderMottaker'> {
  setAvsenderMottaker: (avsenderMottaker: string) => void;
}

const AvsenderMottaker = ({ journalposttype, avsenderMottaker, setAvsenderMottaker }: AvsenderMottakerProps) => {
  if (journalposttype === Journalposttype.NOTAT) {
    return null;
  }

  return (
    <ClickableField
      $area={Fields.AvsenderMottaker}
      onClick={() => setAvsenderMottaker(avsenderMottaker === null ? 'NONE' : avsenderMottaker.id ?? 'UNKNOWN')}
    >
      {formatAvsenderMottaker(avsenderMottaker)}
    </ClickableField>
  );
};

const ExpandButton = styled(Button)`
  grid-area: expand;
`;
