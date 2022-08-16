import React, { useState } from 'react';
import { FnrSearch } from '../../components/search/fnr/fnr-search';
import { NameSearch } from '../../components/search/name/name-search';
import { SearchBox } from '../../components/searchbox/searchbox';
import { OppgaverPageWrapper } from '../page-wrapper';

export const SearchPage = () => {
  const [query, setQuery] = useState<string>('');

  return (
    <OppgaverPageWrapper>
      <SearchBox setQuery={setQuery} />
      <NameSearch queryString={query} />
      <FnrSearch queryString={query} />
    </OppgaverPageWrapper>
  );
};

// eslint-disable-next-line import/no-default-export
export default SearchPage;
