import { Oppgaver } from '@app/components/search/common/oppgaver';
import { FnrSearch } from '@app/components/search/fnr/fnr-search';
import {
  useLazySearchOppgaverBySaksnummerQuery,
  useSearchOppgaverByFnrQuery,
  useSearchPersonByFnrQuery,
} from '@app/redux-api/oppgaver/queries/oppgaver';
import { ErrorMessage, Search, ToggleGroup } from '@navikt/ds-react';
import { dnr, fnr } from '@navikt/fnrvalidator';
import { skipToken } from '@reduxjs/toolkit/query';
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
  const [rawQuery, setRawQuery] = useState('');
  const [fnrError, setFnrError] = useState<string>();
  const [searchSaksnr, saksnrQuery] = useLazySearchOppgaverBySaksnummerQuery();

  const query = removeWhitespace(rawQuery);
  const fnrQueryString = searchType === SearchType.FNR && isFnr(query) ? query : skipToken;
  const personQuery = useSearchPersonByFnrQuery(fnrQueryString);
  const oppgaverQuery = useSearchOppgaverByFnrQuery(fnrQueryString);

  const fetchBySaksnr = () => searchSaksnr(query);

  const refetchByFnr = () => {
    personQuery.refetch();
    oppgaverQuery.refetch();
  };

  const getText = () => {
    switch (searchType) {
      case SearchType.FNR:
        return 'Søk på fødselsnummer';
      case SearchType.SAKSNR:
        return 'Søk på saksnummer';
    }
  };

  const search = () => {
    switch (searchType) {
      case SearchType.FNR:
        if (!isFnr(query)) {
          return setFnrError('Ugyldig fødselsnummer/D-nummer');
        }

        return refetchByFnr();
      case SearchType.SAKSNR:
        setFnrError(undefined);

        return fetchBySaksnr();
    }
  };

  const renderSearchType = () => {
    switch (searchType) {
      case SearchType.FNR:
        return <FnrSearch fnr={rawQuery} personQuery={personQuery} oppgaverQuery={oppgaverQuery} />;
      case SearchType.SAKSNR:
        return <Oppgaver {...saksnrQuery} refetch={fetchBySaksnr} />;
    }
  };

  const text = getText();

  return (
    <>
      <Container>
        <Line>
          <ToggleGroup
            value={searchType}
            onChange={(v) => {
              if (isSearchType(v)) {
                setSearchType(v);
                setFnrError(undefined);
              }
            }}
          >
            <ToggleGroup.Item value={SearchType.FNR} label="Fødselsnummer" />
            <ToggleGroup.Item value={SearchType.SAKSNR} label="Saksnummer" />
          </ToggleGroup>
          <StyledSearch
            size="medium"
            variant="simple"
            onChange={(v) => {
              setRawQuery(v);

              if (isFnr(v)) {
                setFnrError(undefined);
              }
            }}
            data-testid="search-input"
            placeholder={text}
            label={text}
            onKeyDown={({ key }) => {
              if (key === 'Enter') {
                search();
              }
            }}
          >
            <Search.Button
              onClick={search}
              loading={saksnrQuery.isFetching || personQuery.isFetching || oppgaverQuery.isFetching}
            />
          </StyledSearch>
        </Line>
        <ErrorMessage>{fnrError}</ErrorMessage>
      </Container>
      {renderSearchType()}
    </>
  );
};

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
