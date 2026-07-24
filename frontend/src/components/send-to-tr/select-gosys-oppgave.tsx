import { ArrowsCirclepathIcon } from '@navikt/aksel-icons';
import {
  Button,
  Heading,
  HelpText,
  HStack,
  InlineMessage,
  Skeleton,
  type SkeletonProps,
  Table,
  VStack,
} from '@navikt/ds-react';
import { memo } from 'react';
import { TableHeader } from '@/components/gosys-oppgave-table/table-header';
import { GosysOppgaver } from '@/components/send-to-tr/gosys-oppgaver';
import { useGosysOppgaverQuery } from '@/redux-api/gosys-oppgaver';
import type { ListGosysOppgave } from '@/types/oppgavebehandling/oppgavebehandling';

interface SelectGosysOppgaveProps {
  fnr: string;
  ytelseId: string;
  selectedGosysOppgave: ListGosysOppgave | undefined;
  onSelect: (gosysOppgave: ListGosysOppgave) => void;
}

// Memoized to avoid re-rendering the entire Gosys oppgave table whenever an unrelated form field changes.
export const SelectGosysOppgave = memo(({ fnr, ytelseId, selectedGosysOppgave, onSelect }: SelectGosysOppgaveProps) => {
  const { isFetching, refetch } = useGosysOppgaverQuery({ fnr, ytelseId });

  return (
    <>
      <HStack align="center" gap="space-8" marginBlock="space-2">
        <Heading level="2" size="small">
          Velg oppgave i Gosys
        </Heading>
        <HelpText>
          Du må velge en oppgave i Gosys. Dersom saken ikke har en oppgave i Gosys, må du opprette en.
        </HelpText>
        <Button
          variant="tertiary"
          size="small"
          title="Hent oppgaver fra Gosys på nytt"
          icon={<ArrowsCirclepathIcon aria-hidden />}
          onClick={refetch}
          loading={isFetching}
        />
      </HStack>

      <GosysOppgaverContent
        fnr={fnr}
        ytelseId={ytelseId}
        selectedGosysOppgave={selectedGosysOppgave}
        onSelect={onSelect}
      />
    </>
  );
});

SelectGosysOppgave.displayName = 'SelectGosysOppgave';

const GosysOppgaverContent = ({ fnr, ytelseId, onSelect, selectedGosysOppgave }: SelectGosysOppgaveProps) => {
  const { currentData: gosysOppgaver, isFetching, isSuccess } = useGosysOppgaverQuery({ fnr, ytelseId });

  if (isFetching) {
    return <GosysOppgaverSkeleton />;
  }

  if (!isSuccess) {
    return <InlineMessage status="error">Kunne ikke hente oppgaver fra Gosys.</InlineMessage>;
  }

  return (
    <VStack gap="space-16" align="start">
      {gosysOppgaver.length === 0 ? (
        <InlineMessage status="info">Ingen oppgaver i Gosys funnet.</InlineMessage>
      ) : (
        <GosysOppgaver gosysOppgaver={gosysOppgaver} selectedGosysOppgave={selectedGosysOppgave} onSelect={onSelect} />
      )}
    </VStack>
  );
};

const SKELETON_CELLS: SkeletonProps[] = [
  { variant: 'rounded', width: '1.5rem' }, // Expand toggle
  { variant: 'rounded', width: '3rem' }, // Gjelder
  { variant: 'rounded', width: '10rem' }, // Tema
  { variant: 'text', width: '8rem' }, // Frist
  { variant: 'rounded', width: '9rem' }, // Oppgavetype
  { variant: 'text', width: '16rem' }, // Opprettet av
  { variant: 'rounded', width: '12rem' }, // Opprettet av enhet
  { variant: 'rounded', width: '12rem' }, // Tildelt enhet
  { variant: 'text', width: '7rem' }, // Enhetsmappe
  { variant: 'rounded', width: '3rem' }, // Velg
];

const SKELETON_ROWS = [0, 1, 2];

const GosysOppgaverSkeleton = () => (
  <Table size="small" zebraStripes className="w-fit" aria-busy aria-label="Laster oppgaver...">
    <TableHeader showFerdigstilt={false} />
    <Table.Body>
      {SKELETON_ROWS.map((row) => (
        <Table.Row key={row}>
          {SKELETON_CELLS.map(({ variant, width }, column) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: Static placeholder list.
            <Table.DataCell key={column}>
              <Skeleton variant={variant} width={width} />
            </Table.DataCell>
          ))}
        </Table.Row>
      ))}
    </Table.Body>
  </Table>
);
