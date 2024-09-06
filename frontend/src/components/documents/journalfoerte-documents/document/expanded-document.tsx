import { CopyButton, Detail, HelpText, Label } from '@navikt/ds-react';
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
          <NowrapDetail>
            {journalstatus === null ? 'Ingen' : JOURNALSTATUS_NAME[journalstatus]}
            {journalstatus === Journalstatus.MOTTATT ? <MottattHelpText /> : null}
          </NowrapDetail>
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

const MottattHelpText = () => (
  <HelpText>
    <HelpTextContent>
      Denne journalposten har status «Mottatt» og har ikke blitt journalført. Sørg for å få dokumentet journalført
      riktig før du bruker det i saksbehandlingen din.
    </HelpTextContent>
  </HelpText>
);

const HelpTextContent = styled.p`
  font-size: var(--a-spacing-4);
  white-space: normal;
  line-height: var(--a-font-line-height-medium);
  margin: 0;
`;

const StyledExpandedDocument = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: var(--a-spacing-4);
  padding: var(--a-spacing-2);
  height: ${EXPANDED_HEIGHT}px;
  width: calc(100% - var(--a-spacing-4));
  overflow-x: auto;
  border-left: 1px solid var(--a-border-subtle);
  padding-left: var(--a-spacing-4);
  margin-left: var(--a-spacing-4);
`;

const TopRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, min-content);
  grid-column-gap: var(--a-spacing-4);
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
  column-gap: var(--a-spacing-8);
`;

const NowrapDetail = styled(Detail)`
  display: flex;
  align-items: center;
  gap: var(--a-spacing-05);
  height: var(--a-spacing-6);
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
