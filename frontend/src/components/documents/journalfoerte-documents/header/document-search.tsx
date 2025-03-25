import { KeyboardHelp } from '@app/components/documents/journalfoerte-documents/header/keyboard-help';
import { Keys } from '@app/components/documents/journalfoerte-documents/header/keys';
import { useKeyboardContext } from '@app/components/documents/journalfoerte-documents/keyboard/keyboard-context';
import { useHasSeenKeyboardShortcuts } from '@app/hooks/settings/use-setting';
import { HStack, Search } from '@navikt/ds-react';
import { memo, useEffect, useRef, useState } from 'react';
import { Fields } from '../grid';

interface Props {
  setSearch: (value: string) => void;
  search: string;
}

export const DocumentSearch = memo(
  ({ search, setSearch }: Props) => {
    const ref = useRef<HTMLDivElement>(null);
    const modalRef = useRef<HTMLDialogElement>(null);
    const [value, setValue] = useState<string>(search);

    useEffect(() => {
      const timeout = setTimeout(() => {
        dispatch('document-reset', ref.current);
        setSearch(value);
      }, 200);

      return () => clearTimeout(timeout);
    }, [value, setSearch]);

    const {
      down,
      up,
      home,
      end,
      reset,
      collapseVedlegg,
      expandVedlegg,
      collapseAllVedlegg,
      expandAllVedlegg,
      toggleInfo,
      toggleSelect,
      toggleSelectAll,
      selectDown,
      selectUp,
      toggleInclude,
      toggleShowIncludeOnly,
      setAsAttachmentTo,
      rename,
      openInline,
      openNewTab,
      focusedDocumentIndex: activeDocumentIndex,
    } = useKeyboardContext();

    // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: ¯\_(ツ)_/¯
    const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      const mod = event.metaKey || event.ctrlKey;

      if (!event.altKey && !event.shiftKey && !mod && event.key === Keys.ArrowDown) {
        event.preventDefault();
        down();
        return;
      }

      if (mod && event.key === Keys.H) {
        event.preventDefault();
        modalRef.current?.showModal();
        return;
      }

      if (mod && event.key === Keys.M) {
        event.preventDefault();
        toggleShowIncludeOnly();
        return;
      }

      if (activeDocumentIndex === -1) {
        if (event.key === Keys.Escape) {
          event.preventDefault();
          setValue('');
        }

        return;
      }

      if (event.key === Keys.Home || (mod && event.key === Keys.ArrowUp)) {
        event.preventDefault();
        home();
        return;
      }

      if (event.key === Keys.End || (mod && event.key === Keys.ArrowDown)) {
        event.preventDefault();
        end();
        return;
      }

      if (event.key === Keys.PageUp || (event.altKey && !event.shiftKey && event.key === Keys.ArrowUp)) {
        event.preventDefault();
        up(10);
        return;
      }

      if (event.key === Keys.PageDown || (event.altKey && !event.shiftKey && event.key === Keys.ArrowDown)) {
        event.preventDefault();
        down(10);
        return;
      }

      if (event.shiftKey && event.key === Keys.ArrowDown) {
        event.preventDefault();
        selectDown(event.altKey ? 10 : 1);
        return;
      }

      if (event.shiftKey && event.key === Keys.ArrowUp) {
        event.preventDefault();
        selectUp(event.altKey ? 10 : 1);
        return;
      }

      if (event.key === Keys.ArrowUp) {
        event.preventDefault();
        up();
        return;
      }

      if (event.key === Keys.I) {
        event.preventDefault();
        toggleInfo();
        return;
      }

      if (event.key === Keys.M) {
        event.preventDefault();
        mod ? toggleShowIncludeOnly() : toggleInclude();
        return;
      }

      if (event.key === Keys.V) {
        event.preventDefault();
        setAsAttachmentTo();
        return;
      }

      if (event.key === Keys.ArrowRight) {
        event.preventDefault();
        mod ? expandAllVedlegg() : expandVedlegg();
        return;
      }

      if (event.key === Keys.ArrowLeft) {
        event.preventDefault();
        mod ? collapseAllVedlegg() : collapseVedlegg();
        return;
      }

      if (event.key === Keys.N) {
        event.preventDefault();
        rename();
        return;
      }

      if ((mod && event.key === Keys.A) || ((mod || event.shiftKey) && event.key === Keys.Space)) {
        event.preventDefault();
        toggleSelectAll();
        return;
      }

      if (event.key === Keys.Space) {
        event.preventDefault();
        toggleSelect();
        return;
      }

      if (event.key === Keys.Enter) {
        event.preventDefault();
        mod ? openNewTab() : openInline();
        return;
      }

      if (event.key === Keys.Escape) {
        event.preventDefault();
        reset();
        return;
      }
    };

    const { value: hasSeenKeyboardShortcuts, setValue: setHasSeenKeyboardShortcuts } = useHasSeenKeyboardShortcuts();

    useEffect(() => {
      if (hasSeenKeyboardShortcuts) {
        return;
      }

      const timeout = setTimeout(() => {
        modalRef.current?.showModal();
        setHasSeenKeyboardShortcuts(true);
      });

      return () => clearTimeout(timeout);
    }, [hasSeenKeyboardShortcuts, setHasSeenKeyboardShortcuts]);

    return (
      <div ref={ref} style={{ gridArea: Fields.Title }}>
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
          />

          <KeyboardHelp ref={modalRef} />
        </HStack>
      </div>
    );
  },
  (prevProps, nextProps) => prevProps.search === nextProps.search && prevProps.setSearch === nextProps.setSearch,
);

DocumentSearch.displayName = 'DocumentSearch';

const dispatch = (eventName: string, element: HTMLDivElement | null) =>
  element?.dispatchEvent(new CustomEvent(eventName, { bubbles: true, cancelable: true }));
