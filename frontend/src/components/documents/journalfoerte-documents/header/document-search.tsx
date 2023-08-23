import { Search } from '@navikt/ds-react';
import React, { memo, useEffect, useState } from 'react';

interface Props {
  setSearch: (value: string) => void;
  search: string;
}

export const DocumentSearch = memo(
  ({ search, setSearch }: Props) => {
    const [_search, _setSearch] = useState<string>(search);

    useEffect(() => {
      const timeout = setTimeout(() => setSearch(_search), 200);

      return () => clearTimeout(timeout);
    }, [_search, setSearch]);

    return (
      <Search
        label="Tittel/journalpost-ID"
        hideLabel
        size="small"
        variant="simple"
        placeholder="Tittel/journalpost-ID"
        onChange={_setSearch}
        value={_search}
      />
    );
  },
  (prevProps, nextProps) => prevProps.search === nextProps.search && prevProps.setSearch === nextProps.setSearch,
);

DocumentSearch.displayName = 'DocumentSearch';
