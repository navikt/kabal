import { useState } from 'react';
import { FnrSearch } from '@app/components/search/fnr/fnr-search';
import { NameSearch } from '@app/components/search/name/name-search';
import { SearchBox } from '@app/components/searchbox/searchbox';
import { SearchPageWrapper } from '../page-wrapper';

export const SearchPage = () => {
  const [query, setQuery] = useState<string>('');

  return (
    <SearchPageWrapper>
      <SearchBox setQuery={setQuery} />
      <NameSearch queryString={query} />
      <FnrSearch queryString={query} />
    </SearchPageWrapper>
  );
};
