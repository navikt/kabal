import { useCallback, useDeferredValue, useId, useMemo, useRef, useState } from 'react';
import { scrollPopoverIntoView } from '@/components/searchable-select/scroll-popover-into-view';
import { optionEntriesMatch } from '@/components/searchable-select/searchable-single-select/single-select-utils';
import type { SearchableSelectProps } from '@/components/searchable-select/searchable-single-select/types';
import { SelectPopover } from '@/components/searchable-select/select-popover';
import { useHighlight } from '@/components/searchable-select/use-highlight';
import { useKeyboardNavigation } from '@/components/searchable-select/use-keyboard-navigation';
import { usePopoverState } from '@/components/searchable-select/use-popover-state';
import {
  type Entry,
  getOptionId,
  VirtualizedOptionList,
  type VirtualizedOptionListHandle,
} from '@/components/searchable-select/virtualized-option-list';
import { VisualRadio } from '@/components/searchable-select/visual-radio';
import { fuzzyMatch } from '@/functions/fuzzy-match';
import { isMetaKey, Keys } from '@/keys';

const CONFIRM_KEYBOARD_SHORTCUTS = [{ shortcuts: ['Enter'], description: 'Velg' }];

export const EditableSelect = <T,>({
  id,
  label,
  options,
  value,
  onChange,
  disabled = false,
  loading = false,
  error,
  confirmLabel = 'Velg',
  requireConfirmation = false,
  flip,
  scrollContainerRef,
  triggerSize,
  triggerVariant,
  style,
  nullLabel,
}: SearchableSelectProps<T>) => {
  const [search, setSearch] = useState('');
  const deferredSearch = useDeferredValue(search);
  const [draftValue, setDraftValue] = useState<Entry<T> | null>(null);
  const virtualizedOptionListHandle = useRef<VirtualizedOptionListHandle>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const scrolledRef = useRef<number>(null);
  const savedScrollTopRef = useRef<number | null>(null);

  const draftValueRef = useRef<Entry<T> | null>(null);
  draftValueRef.current = draftValue;

  const listboxId = useId();

  const { highlightedIndex, setHighlightedIndex, highlightedIndexRef } = useHighlight(deferredSearch);

  const confirmDraft = useCallback(
    (draft: Entry<T> | null) => {
      if (draft === null || optionEntriesMatch(draft, value)) {
        return;
      }

      onChange(draft.value);
    },
    [value, onChange],
  );

  const { open, buttonRef, handleClose, handleButtonClick, onButtonKeyDown } = usePopoverState({
    onOpen: () => {
      savedScrollTopRef.current = scrollContainerRef?.current?.scrollTop ?? null;
      setSearch('');
      setHighlightedIndex(0);
      setDraftValue(null);

      requestAnimationFrame(() => {
        scrolledRef.current = scrollPopoverIntoView(scrollContainerRef, popoverRef);
      });
    },
    onClose: () => {
      if (!requireConfirmation) {
        confirmDraft(draftValueRef.current);
      }

      setDraftValue(null);

      // Restore scroll position after focus, so the browser's auto-scroll from focus() doesn't override the restore.
      requestAnimationFrame(() => {
        const container = scrollContainerRef?.current;

        if (
          container !== null &&
          container !== undefined &&
          savedScrollTopRef.current !== null &&
          scrolledRef.current !== null &&
          container.scrollTop === scrolledRef.current
        ) {
          container.scrollTo({ top: savedScrollTopRef.current, behavior: 'smooth' });
          savedScrollTopRef.current = null;
        }
      });
    },
  });

  const filteredOptions: Entry<T>[] = useMemo(
    () => (deferredSearch.length === 0 ? options : options.filter((o) => fuzzyMatch(o.plainText, deferredSearch))),
    [options, deferredSearch],
  );

  const handleConfirm = useCallback(() => {
    confirmDraft(draftValue);
    handleClose();
  }, [draftValue, confirmDraft, handleClose]);

  const scrollToIndex = useCallback((index: number) => {
    virtualizedOptionListHandle.current?.scrollToIndex(index);
  }, []);

  const handleNavigation = useKeyboardNavigation({
    filteredOptionsLength: filteredOptions.length,
    setHighlightedIndex,
    onEscape: handleClose,
    scrollToIndex,
  });

  const getHighlightedOption = useCallback(
    (filteredOptions: (Entry<T> | null)[]) => {
      const idx = highlightedIndexRef.current;

      if (idx >= 0 && idx < filteredOptions.length) {
        return filteredOptions[idx];
      }
    },
    [highlightedIndexRef],
  );

  const confirmAndClose = useCallback(
    (option: Entry<T> | null | undefined) => {
      if (option === undefined) {
        return;
      }

      requestAnimationFrame(() => confirmDraft(option));
      handleClose();
    },
    [confirmDraft, handleClose],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === Keys.Enter && isMetaKey(e)) {
        e.preventDefault();

        if (requireConfirmation) {
          confirmAndClose(draftValueRef.current);
        } else {
          const option = getHighlightedOption(filteredOptions);
          confirmAndClose(option);
        }

        return;
      }

      if (handleNavigation(e)) {
        return;
      }

      if (e.key === Keys.Enter) {
        e.preventDefault();
        const option = getHighlightedOption(filteredOptions);

        if (option === undefined) {
          return;
        }

        if (requireConfirmation) {
          setDraftValue(option);
        } else {
          confirmAndClose(option);
        }
      }
    },
    [filteredOptions, handleNavigation, requireConfirmation, getHighlightedOption, confirmAndClose],
  );

  const handleOptionSelect = useCallback(
    (option: Entry<T> | null) => {
      if (requireConfirmation) {
        setDraftValue(option);
      } else {
        confirmAndClose(option);
      }
    },
    [requireConfirmation, confirmAndClose],
  );

  const hasDraftChange = !optionEntriesMatch(draftValue, value);
  const displayKey = draftValue !== null ? draftValue.key : value?.key;

  // Build the set of selected keys for aria-selected on option elements.
  const selectedKeys = useMemo<Set<string>>(
    () => (displayKey === undefined ? new Set() : new Set([displayKey])),
    [displayKey],
  );

  // Compute the active descendant id for the currently highlighted option.
  const activeDescendantId = useMemo(() => {
    if (highlightedIndex < 0 || highlightedIndex >= filteredOptions.length) {
      return undefined;
    }

    const option = filteredOptions[highlightedIndex];

    if (option === undefined) {
      return undefined;
    }

    return getOptionId(listboxId, option.key);
  }, [highlightedIndex, filteredOptions, listboxId]);

  // Status message for screen readers announcing the number of filtered results.
  const statusMessage = useMemo(() => {
    if (deferredSearch.length === 0) {
      return undefined;
    }

    const count = filteredOptions.length;

    if (count === 0) {
      return 'Ingen treff';
    }

    return `${count} ${count === 1 ? 'resultat' : 'resultater'}`;
  }, [deferredSearch, filteredOptions.length]);

  return (
    <SelectPopover
      id={id}
      label={label}
      open={open}
      disabled={disabled}
      loading={loading}
      error={error}
      search={search}
      onSearchChange={setSearch}
      buttonRef={buttonRef}
      popoverRef={popoverRef}
      onButtonClick={handleButtonClick}
      onButtonKeyDown={onButtonKeyDown}
      onClose={handleClose}
      onPopoverKeyDown={handleKeyDown}
      hasDraftChange={hasDraftChange}
      confirmLabel={confirmLabel}
      onConfirm={handleConfirm}
      keyboardShortcuts={
        requireConfirmation
          ? CONFIRM_KEYBOARD_SHORTCUTS
          : [{ shortcuts: ['Enter'], description: `${confirmLabel} og lukk` }]
      }
      flip={flip}
      trigger={value?.label ?? nullLabel}
      triggerSize={triggerSize}
      triggerVariant={triggerVariant}
      style={style}
      showConfirm={requireConfirmation}
      listboxId={listboxId}
      activeDescendantId={activeDescendantId}
      statusMessage={statusMessage}
    >
      {filteredOptions.length === 0 ? (
        <div className="px-3 py-2 italic">Ingen treff</div>
      ) : (
        <VirtualizedOptionList
          enabled={open}
          options={filteredOptions}
          highlightedIndex={highlightedIndex}
          onHighlight={setHighlightedIndex}
          handleRef={virtualizedOptionListHandle}
          listboxId={listboxId}
          selectedKeys={selectedKeys}
          onSelect={handleOptionSelect}
          renderOption={(option) => (
            <VisualRadio checked={selectedKeys.has(option.key)} className="w-full">
              {option.label}
            </VisualRadio>
          )}
        />
      )}
    </SelectPopover>
  );
};
