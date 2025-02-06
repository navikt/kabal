import { EXPANDED_HEIGHT } from '@app/components/documents/journalfoerte-documents/contants';
import { type IArkivertDocument, Journalstatus } from '@app/types/arkiverte-documents';
import { Box, CopyButton, Detail, HStack, HelpText, Label, VStack } from '@navikt/ds-react';
import { styled } from 'styled-components';
import { Timeline } from './timeline/timeline';

interface ExpandedDocumentProps {
  document: IArkivertDocument;
}

export const ExpandedDocument = ({ document }: ExpandedDocumentProps) => {
  const { journalstatus, kanalnavn, opprettetAvNavn, journalpostId } = document;

  return (
    <VStack asChild gap="4 0" height={`${EXPANDED_HEIGHT}px`} width="calc(100% - var(--a-spacing-4))" overflowX="auto">
      <Box paddingBlock="2" paddingInline="4 2" marginInline="4 0" borderWidth="0 0 0 1" borderColor="border-divider">
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
        <HStack gap="8">
          <Timeline {...document} />
        </HStack>
      </Box>
    </VStack>
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

const TopRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, min-content);
  grid-column-gap: var(--a-spacing-4);
  white-space: nowrap;
  position: sticky;
  left: 0;
`;

interface SectionProps {
  children: React.ReactNode;
}

const Section = ({ children }: SectionProps) => (
  <VStack overflow="hidden" as="section">
    {children}
  </VStack>
);

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
