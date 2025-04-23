import { EVENT_DOMAIN } from '@app/components/documents/journalfoerte-documents/keyboard/use-keyboard';
import { Keys } from '@app/keys';
import { pushEvent } from '@app/observability';
import { HStack, Search } from '@navikt/ds-react';
import { memo, useCallback, useEffect, useState } from 'react';
import { Fields } from '../grid';

interface Props {
  setSearch: (value: string) => void;
  search: string;
  keyboardBoundaryRef: React.RefObject<HTMLDivElement | null>;
  ref: React.RefObject<HTMLInputElement | null>;
}

export const DocumentSearch = memo(
  ({ search, setSearch, ref, keyboardBoundaryRef }: Props) => {
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
      <HStack style={{ gridArea: Fields.Title }}>
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
          clearButton
          onKeyDown={(e) => {
            if (e.key === Keys.Enter) {
              e.stopPropagation();
              e.preventDefault();
              keyboardBoundaryRef.current?.focus({ preventScroll: true });
              pushEvent('keyboard-shortcut-focus-list', EVENT_DOMAIN);
              return;
            }

            if (e.key === Keys.Escape) {
              pushEvent('keyboard-shortcut-clear-search', EVENT_DOMAIN);
              return;
            }
          }}
          ref={ref}
        />
      </HStack>
    );
  },
  (prevProps, nextProps) => prevProps.search === nextProps.search && prevProps.setSearch === nextProps.setSearch,
);

DocumentSearch.displayName = 'DocumentSearch';
