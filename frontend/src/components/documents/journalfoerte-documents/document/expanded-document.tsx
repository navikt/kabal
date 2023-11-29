import { CopyButton, Detail, Label } from '@navikt/ds-react';
import React from 'react';
import { styled } from 'styled-components';
import { EXPANDED_HEIGHT } from '@app/components/documents/journalfoerte-documents/contants';
import { IArkivertDocument, Journalstatus } from '@app/types/arkiverte-documents';
import { Timeline } from './timeline/timeline';

interface ExpandedDocumentProps {
  document: IArkivertDocument;
}

export const ExpandedDocument = ({ document }: ExpandedDocumentProps) => {
  const { journalstatus, kanalnavn, opprettetAvNavn, journalpostId } = document;

  return (
    <StyledExpandedDocument>
      <TopRow>
        <Section>
          <Label size="small">Status</Label>
          <NowrapDetail>{journalstatus === null ? 'Ingen' : JOURNALSTATUS_NAME[journalstatus]}</NowrapDetail>
        </Section>

        <Section>
          <Label size="small">Kanal</Label>
          <NowrapDetail>{kanalnavn}</NowrapDetail>
        </Section>

        <Section>
          <Label size="small">Journalpost-ID</Label>
          <CopyButton copyText={journalpostId} activeText="Kopiert!" size="xsmall" text={journalpostId} />
        </Section>

        <Section>
          <Label size="small">Journalpost opprettet av</Label>
          <NowrapDetail title={opprettetAvNavn ?? undefined}>{opprettetAvNavn}</NowrapDetail>
        </Section>
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
  height: ${EXPANDED_HEIGHT}px;
  width: 100%;
  overflow-x: auto;
`;

const TopRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, min-content);
  grid-column-gap: 16px;
  white-space: nowrap;
  position: sticky;
  left: 0;
`;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const MetadataRow = styled.div`
  display: flex;
  flex-direction: row;
  column-gap: 32px;
`;

const NowrapDetail = styled(Detail)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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
