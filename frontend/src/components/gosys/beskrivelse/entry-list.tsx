import { Box, VStack } from '@navikt/ds-react';
import { Entry } from '@/components/gosys/beskrivelse/entry';
import type { GosysBeskrivelseEntry } from '@/components/gosys/beskrivelse/parsing/type';

interface Props {
  entries: GosysBeskrivelseEntry[];
}

export const EntryList = ({ entries }: Props) => (
  <VStack as="ul" gap="space-8" marginBlock="space-8 space-0">
    {entries.map((entry) => (
      <Box
        as="li"
        key={entry.id}
        padding="space-8"
        borderRadius="4"
        className="odd:bg-ax-bg-sunken even:bg-ax-bg-neutral-soft"
      >
        <Entry {...entry} />
      </Box>
    ))}
  </VStack>
);
