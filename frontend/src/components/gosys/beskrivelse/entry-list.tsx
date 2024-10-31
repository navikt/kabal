import { Entry } from '@app/components/gosys/beskrivelse/entry';
import type { GosysBeskrivelseEntry } from '@app/components/gosys/beskrivelse/parsing/type';
import { StyledEntryList } from '@app/components/gosys/beskrivelse/styled-entry-list';
import { styled } from 'styled-components';

interface Props {
  entries: GosysBeskrivelseEntry[];
}

export const EntryList = ({ entries }: Props) => (
  <StyledEntryList $marginTop>
    {entries.map((entry) => (
      <Container key={entry.id}>
        <Entry {...entry} />
      </Container>
    ))}
  </StyledEntryList>
);

const Container = styled.li`
  padding: var(--a-spacing-2);
  border-radius: var(--a-border-radius-medium);

  &:nth-child(odd) {
    background-color: var(--a-surface-subtle);
  }

  &:nth-child(even) {
    background-color: var(--a-surface-active);
  }
`;
