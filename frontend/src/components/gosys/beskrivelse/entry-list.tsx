import { Entry } from '@app/components/gosys/beskrivelse/entry';
import type { GosysBeskrivelseEntry } from '@app/components/gosys/beskrivelse/parsing/type';
import { BoxNew, VStack } from '@navikt/ds-react';

interface Props {
  entries: GosysBeskrivelseEntry[];
}

export const EntryList = ({ entries }: Props) => (
  <VStack as="ul" gap="2" marginBlock="2 0">
    {entries.map((entry) => (
      <BoxNew
        as="li"
        key={entry.id}
        padding="2"
        borderRadius="medium"
        className="odd:bg-ax-bg-sunken even:bg-ax-bg-neutral-soft"
      >
        <Entry {...entry} />
      </BoxNew>
    ))}
  </VStack>
);
