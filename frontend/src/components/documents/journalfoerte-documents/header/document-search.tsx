import { KeyboardHelpButton } from '@app/components/documents/journalfoerte-documents/header/keyboard-help-button';
import { HStack, Search } from '@navikt/ds-react';
import { memo, useCallback, useEffect, useState } from 'react';
import { Fields } from '../grid';

interface Props {
  setSearch: (value: string) => void;
  search: string;
  ref?: React.RefObject<HTMLInputElement | null>;
}

export const DocumentSearch = memo(
  ({ search, setSearch, ref }: Props) => {
    const [value, setValue] = useState<string>(search);

    useEffect(() => {
      const timeout = setTimeout(() => {
        setSearch(value);
      }, 200);

      return () => clearTimeout(timeout);
    }, [value, setSearch]);

    const onClear = useCallback(() => {
      setValue('');
      setSearch('');
    }, [setSearch]);

    return (
      <div style={{ gridArea: Fields.Title }}>
        <HStack align="center" gap="1" wrap={false}>
          <Search
            label="Tittel/journalpost-ID"
            hideLabel
            size="small"
            variant="simple"
            placeholder="Tittel/journalpost-ID"
            onChange={setValue}
            onClear={onClear}
            value={value}
            autoComplete="off"
            ref={ref}
          />

          <KeyboardHelpButton />
        </HStack>
      </div>
    );
  },
  (prevProps, nextProps) => prevProps.search === nextProps.search && prevProps.setSearch === nextProps.setSearch,
);

DocumentSearch.displayName = 'DocumentSearch';
