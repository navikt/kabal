import { Search } from '@navikt/ds-react';
import React, { memo } from 'react';

interface Props {
  setSearch: (value: string) => void;
  search: string;
}

export const DocumentSearch = memo(
  ({ search, setSearch }: Props) => (
    <Search
      label="Tittel/journalpost-ID"
      hideLabel
      size="small"
      variant="simple"
      placeholder="Tittel/journalpost-ID"
      onChange={setSearch}
      value={search}
    />
  ),
  (prevProps, nextProps) => prevProps.search === nextProps.search && prevProps.setSearch === nextProps.setSearch
);

DocumentSearch.displayName = 'DocumentSearch';
