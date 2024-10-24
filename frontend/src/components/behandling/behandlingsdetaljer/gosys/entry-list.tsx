import { Entry } from '@app/components/behandling/behandlingsdetaljer/gosys/entry';
import type { GosysBeskrivelseEntry } from '@app/components/behandling/behandlingsdetaljer/gosys/parsing/type';
import { StyledEntryList } from '@app/components/behandling/behandlingsdetaljer/gosys/styled-entry-list';
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
