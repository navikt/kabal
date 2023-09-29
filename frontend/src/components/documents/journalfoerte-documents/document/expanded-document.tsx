import { CopyButton, Detail, Label } from '@navikt/ds-react';
import React, { useEffect, useRef } from 'react';
import { styled } from 'styled-components';
import { IArkivertDocument, Journalstatus } from '@app/types/arkiverte-documents';
import { Timeline } from './timeline/timeline';

interface ExpandedDocumentProps {
  document: IArkivertDocument;
}

export const ExpandedDocument = ({ document }: ExpandedDocumentProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current !== null) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
    }
  }, []);

  const { journalstatus, kanalnavn, opprettetAvNavn, journalpostId } = document;

  return (
    <StyledExpandedDocument ref={ref}>
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
          <CopyButton copyText={journalpostId} activeText="Kopiert!" size="xsmall" text={journalpostId} />
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
  grid-template-columns: repeat(4, auto);
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
