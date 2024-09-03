import { styled } from 'styled-components';
import { Entry } from '@app/components/behandling/behandlingsdetaljer/gosys/entry';
import { IBeskrivelse } from '@app/components/behandling/behandlingsdetaljer/gosys/split-beskrivelse';
import { StyledEntryList } from '@app/components/behandling/behandlingsdetaljer/gosys/styled-entry-list';

interface Props {
  entries: IBeskrivelse[];
}

export const EntryList = ({ entries }: Props) => (
  <StyledEntryList>
    {entries.map((entry, index) => (
      <Container key={index}>
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
