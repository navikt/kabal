import { Oppgaver } from '@app/components/search/common/oppgaver';
import { Person } from '@app/components/search/fnr/person';
import {
  useLazySearchOppgaverByFnrQuery,
  useLazySearchOppgaverBySaksnummerQuery,
  useLazySearchPersonByFnrQuery,
} from '@app/redux-api/oppgaver/queries/oppgaver';
import { ErrorMessage, Search, type SearchProps, ToggleGroup } from '@navikt/ds-react';
import { dnr, fnr } from '@navikt/fnrvalidator';
import { useState } from 'react';
import { styled } from 'styled-components';

enum SearchType {
  SAKSNR = 'SAKSNR',
  FNR = 'FNR',
}

const SEARCH_TYPES = Object.values(SearchType);
const isSearchType = (searchType: string): searchType is SearchType => SEARCH_TYPES.some((type) => type === searchType);

const isFnr = (str: string) => fnr(str).status === 'valid' || dnr(str).status === 'valid';
const removeWhitespace = (str: string) => str.replaceAll(/\s+/gi, '');

export const OppgaveSearch = () => {
  const [searchType, setSearchType] = useState(SearchType.FNR);

  const toggleGroup = (
    <ToggleGroup
      value={searchType}
      onChange={(v) => {
        if (isSearchType(v)) {
          setSearchType(v);
        }
      }}
    >
      <ToggleGroup.Item value={SearchType.FNR} label="Fødselsnummer" />
      <ToggleGroup.Item value={SearchType.SAKSNR} label="Saksnummer" />
    </ToggleGroup>
  );

  switch (searchType) {
    case SearchType.FNR:
      return <FnrSearch>{toggleGroup}</FnrSearch>;
    case SearchType.SAKSNR:
      return <SaksnrSearch>{toggleGroup}</SaksnrSearch>;
  }
};

interface Props {
  children: React.ReactNode;
}

const FnrSearch = ({ children }: Props) => {
  const [rawQuery, setRawQuery] = useState('');
  const [error, setError] = useState<string>();
  const [fetchPerson, personQuery] = useLazySearchPersonByFnrQuery();
  const [fetchOppgaver, oppgaverQuery] = useLazySearchOppgaverByFnrQuery();
  const trimmedQuery = removeWhitespace(rawQuery);

  const validateAndFetch = (fetchFn: () => void) => {
    if (isFnr(trimmedQuery)) {
      setError(undefined);
      fetchFn();
    } else {
      setError('Ugyldig fødselsnummer/D-nummer');
    }
  };

  const forceSearch = () =>
    validateAndFetch(() => {
      fetchPerson(trimmedQuery);
      fetchOppgaver(trimmedQuery);
    });

  return (
    <>
      <Container>
        <Line>
          {children}

          <SearchField
            label="Søk på fødselsnummer"
            onChange={(v) => {
              setRawQuery(v);

              const trimmed = removeWhitespace(v);

              if (isFnr(trimmed)) {
                setError(undefined);
                fetchPerson(trimmed);
                fetchOppgaver(trimmed);
              }
            }}
            onKeyDown={forceSearch}
          >
            <Search.Button onClick={forceSearch} loading={personQuery.isFetching || oppgaverQuery.isFetching} />
          </SearchField>
        </Line>

        <ErrorMessage>{error}</ErrorMessage>
      </Container>

      <Person {...personQuery} fnr={rawQuery} refetch={() => validateAndFetch(() => fetchPerson(trimmedQuery))} />
      <Oppgaver {...oppgaverQuery} refetch={() => validateAndFetch(() => fetchOppgaver(trimmedQuery))} />
    </>
  );
};

const SaksnrSearch = ({ children }: Props) => {
  const [rawQuery, setRawQuery] = useState('');
  const query = removeWhitespace(rawQuery);
  const [fetchOppgaver, oppgaverQuery] = useLazySearchOppgaverBySaksnummerQuery();

  const search = () => fetchOppgaver(query);

  return (
    <Container>
      <Line>
        {children}

        <SearchField label="Søk på saksnummer" onChange={setRawQuery} onKeyDown={search}>
          <Search.Button onClick={search} loading={oppgaverQuery.isFetching} />
        </SearchField>
      </Line>

      <Oppgaver {...oppgaverQuery} refetch={search} />
    </Container>
  );
};

const SearchField = ({
  onChange,
  onKeyDown,
  label,
  children,
}: { onChange: SearchProps['onChange']; label: string; onKeyDown: () => void; children: SearchProps['children'] }) => (
  <StyledSearch
    size="medium"
    variant="simple"
    onChange={onChange}
    data-testid="search-input"
    placeholder={label}
    label={label}
    onKeyDown={({ key }) => {
      if (key === 'Enter') {
        onKeyDown();
      }
    }}
  >
    {children}
  </StyledSearch>
);

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--a-spacing-2);
  padding: var(--a-spacing-4);
`;

const StyledSearch = styled(Search)`
  width: 270px;
`;

const Line = styled.div`
  display: flex;
  gap: var(--a-spacing-05);
`;
