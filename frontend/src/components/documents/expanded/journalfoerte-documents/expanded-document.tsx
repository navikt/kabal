import { Detail, Label } from '@navikt/ds-react';
import { CopyToClipboard } from '@navikt/ds-react-internal';
import React from 'react';
import styled from 'styled-components';
import { IArkivertDocument, Journalstatus } from '@app/types/arkiverte-documents';
import { Timeline } from './timeline/timeline';

interface ExpandedDocumentProps {
  show: boolean;
  document: IArkivertDocument;
}

export const ExpandedDocument = ({ show, document }: ExpandedDocumentProps) => {
  if (!show) {
    return null;
  }

  const { journalstatus, kanalnavn, opprettetAvNavn, journalpostId } = document;

  return (
    <StyledExpandedDocument>
      <TopRow>
        <section>
          <Label size="small">Status</Label>
          <Detail>{journalstatus === null ? 'Ingen' : JOURNALSTATUS_NAME[journalstatus]}</Detail>
        </section>

        <section>
          <Label size="small">Kanal</Label>
          <Detail>{kanalnavn}</Detail>
        </section>

        <section>
          <Label size="small">Journalpost-ID</Label>
          <CopyToClipboard copyText={journalpostId} popoverText="Kopiert!" size="xsmall">
            <Detail>{journalpostId}</Detail>
          </CopyToClipboard>
        </section>

        <section>
          <Label size="small">Journalpost opprettet av</Label>
          <Detail>{opprettetAvNavn}</Detail>
        </section>
      </TopRow>
      <MetadataRow>
        <Timeline {...document} />
      </MetadataRow>
    </StyledExpandedDocument>
  );
};

const StyledExpandedDocument = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 16px;
  padding: 8px;
  border-bottom: 1px solid var(--a-border-default);
  background-color: var(--a-surface-subtle);
`;

const TopRow = styled.div`
  display: grid;
  grid-template-columns: 150px 210px 110px auto;
  grid-column-gap: 16px;
`;

const MetadataRow = styled.div`
  display: flex;
  flex-direction: row;
  column-gap: 32px;
`;

const JOURNALSTATUS_NAME: Record<Journalstatus, string> = {
  [Journalstatus.MOTTATT]: 'Mottatt',
  [Journalstatus.JOURNALFOERT]: 'Journalført',
  [Journalstatus.FERDIGSTILT]: 'Ferdigstilt',
  [Journalstatus.EKSPEDERT]: 'Ekspedert',
  [Journalstatus.UNDER_ARBEID]: 'Under arbeid',
  [Journalstatus.FEILREGISTRERT]: 'Feilregistrert',
  [Journalstatus.UTGAAR]: 'Utgår',
  [Journalstatus.AVBRUTT]: 'Avbrutt',
  [Journalstatus.UKJENT_BRUKER]: 'Ukjent bruker',
  [Journalstatus.RESERVERT]: 'Reservert',
  [Journalstatus.OPPLASTING_DOKUMENT]: 'Opplasting dokument',
  [Journalstatus.UKJENT]: 'Ukjent',
};
