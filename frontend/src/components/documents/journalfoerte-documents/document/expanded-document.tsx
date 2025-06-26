import { EXPANDED_HEIGHT } from '@app/components/documents/journalfoerte-documents/contants';
import { type IArkivertDocument, Journalstatus } from '@app/types/arkiverte-documents';
import { Box, CopyButton, HelpText, HStack, Label, VStack } from '@navikt/ds-react';
import { Timeline } from './timeline/timeline';

interface ExpandedDocumentProps {
  document: IArkivertDocument;
}

export const ExpandedDocument = ({ document }: ExpandedDocumentProps) => {
  const { journalstatus, kanalnavn, opprettetAvNavn, journalpostId } = document;

  return (
    <VStack asChild gap="4 0" height={`${EXPANDED_HEIGHT}px`} width="calc(100% - var(--a-spacing-4))" overflowX="auto">
      <Box paddingBlock="2" paddingInline="4 2" marginInline="4 0" borderWidth="0 0 0 1" borderColor="border-divider">
        <HStack gap="0 4" position="sticky" left="0" className="whitespace-nowrap" wrap={false}>
          <Section>
            <Label size="small">Status</Label>
            <Data>
              {journalstatus === null ? 'Ingen' : JOURNALSTATUS_NAME[journalstatus]}
              {journalstatus === Journalstatus.MOTTATT ? <MottattHelpText /> : null}
            </Data>
          </Section>

          <Section>
            <Label size="small">Kanal</Label>
            <Data>{kanalnavn}</Data>
          </Section>

          <Section>
            <Label size="small">Journalpost-ID</Label>
            <CopyButton copyText={journalpostId} activeText="Kopiert!" size="xsmall" text={journalpostId} />
          </Section>

          <Section>
            <Label size="small">Journalpost opprettet av</Label>
            <Data title={opprettetAvNavn ?? undefined}>{opprettetAvNavn}</Data>
          </Section>
        </HStack>
        <HStack gap="8">
          <Timeline {...document} />
        </HStack>
      </Box>
    </VStack>
  );
};

const MottattHelpText = () => (
  <HelpText>
    <p className="m-0 whitespace-normal text-base">
      Denne journalposten har status «Mottatt» og har ikke blitt journalført. Sørg for å få dokumentet journalført
      riktig før du bruker det i saksbehandlingen din.
    </p>
  </HelpText>
);

interface SectionProps {
  children: React.ReactNode;
}

const Section = ({ children }: SectionProps) => (
  <VStack overflow="hidden" as="section" flexShrink="0">
    {children}
  </VStack>
);

interface DetailsProps {
  children: React.ReactNode;
  title?: string;
}

const Data = ({ children, title }: DetailsProps) => (
  <HStack
    as="p"
    title={title}
    gap="05"
    align="center"
    height="6"
    wrap={false}
    overflow="hidden"
    className="text-ellipsis whitespace-nowrap"
  >
    {children}
  </HStack>
);

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
