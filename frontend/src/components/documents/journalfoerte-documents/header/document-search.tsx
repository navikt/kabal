import { KeyboardHelp } from '@app/components/documents/journalfoerte-documents/header/keyboard-help';
import { useKeyboard } from '@app/components/documents/journalfoerte-documents/keyboard/use-keyboard';
import { useHasSeenKeyboardShortcuts } from '@app/hooks/settings/use-setting';
import { HStack, Search } from '@navikt/ds-react';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { Fields } from '../grid';

interface Props {
  setSearch: (value: string) => void;
  search: string;
}

export const DocumentSearch = memo(
  ({ search, setSearch }: Props) => {
    const helpModalRef = useRef<HTMLDialogElement>(null);
    const [value, setValue] = useState<string>(search);

    useEffect(() => {
      const timeout = setTimeout(() => {
        setSearch(value);
      }, 200);

      return () => clearTimeout(timeout);
    }, [value, setSearch]);

    const { setValue: setHasSeenKeyboardShortcuts } = useHasSeenKeyboardShortcuts();

    const showHelpModal = useCallback(() => {
      helpModalRef.current?.showModal();
      setHasSeenKeyboardShortcuts(true);
    }, [setHasSeenKeyboardShortcuts]);

    const clearSearch = useCallback(() => {
      setValue('');
      setSearch('');
    }, [setSearch]);

    const onKeyDown = useKeyboard(showHelpModal, clearSearch);

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
            value={value}
            onKeyDown={onKeyDown}
            autoComplete="off"
          />

          <KeyboardHelp ref={helpModalRef} showModal={showHelpModal} />
        </HStack>
      </div>
    );
  },
  (prevProps, nextProps) => prevProps.search === nextProps.search && prevProps.setSearch === nextProps.setSearch,
);

DocumentSearch.displayName = 'DocumentSearch';
