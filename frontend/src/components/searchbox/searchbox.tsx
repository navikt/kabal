import { Search } from '@navikt/ds-react';
import { styled } from 'styled-components';

interface SearchBoxProps {
  setQuery: (query: string) => void;
}

export const SearchBox = ({ setQuery }: SearchBoxProps): JSX.Element => (
  <StyledContainer>
    <StyledSearch
      size="medium"
      variant="simple"
      onChange={(value) => setTimeout(() => setQuery(value), 0)}
      data-testid="search-input"
      placeholder="Søk på navn eller fødselsnummer"
      label="Søk på navn eller fødselsnummer"
    />
  </StyledContainer>
);

const StyledSearch = styled(Search)`
  max-width: 40em;
`;

const StyledContainer = styled.div`
  padding: 16px;
`;
