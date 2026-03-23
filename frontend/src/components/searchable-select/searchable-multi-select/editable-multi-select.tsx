import { CheckmarkIcon, XMarkIcon } from '@navikt/aksel-icons';
import { Button, Checkbox, CheckboxGroup } from '@navikt/ds-react';
import { useCallback, useDeferredValue, useMemo, useRef, useState } from 'react';
import { scrollPopoverIntoView } from '@/components/searchable-select/scroll-popover-into-view';
import { setsEqual } from '@/components/searchable-select/searchable-multi-select/multi-select-utils';
import { TriggerContent } from '@/components/searchable-select/searchable-multi-select/trigger-content';
import type { SearchableMultiSelectProps } from '@/components/searchable-select/searchable-multi-select/types';
import { SelectPopover } from '@/components/searchable-select/select-popover';
import { useHighlight } from '@/components/searchable-select/use-highlight';
import { useKeyboardNavigation } from '@/components/searchable-select/use-keyboard-navigation';
import { usePopoverState } from '@/components/searchable-select/use-popover-state';
import {
  VirtualizedOptionList,
  type VirtualizedOptionListHandle,
} from '@/components/searchable-select/virtualized-option-list';
import { stringToRegExp } from '@/functions/string-to-regex';
import { isMetaKey, Keys } from '@/keys';

const KEYBOARD_SHORTCUTS = [{ shortcuts: ['Enter'], description: 'Velg / fjern' }];

export const EditableMultiSelect = <T,>({
  id,
  label,
  style,
  options,
  value,
  valueKey,
  formatOption,
  emptyLabel,
  filterText,
  onChange,
  disabled = false,
  error,
  confirmLabel = 'Bekreft',
  flip,
  scrollContainerRef,
  triggerSize,
  triggerVariant,
  triggerDisplay = 'pills',
  requireConfirmation = false,
  showSelectAll = false,
}: SearchableMultiSelectProps<T>) => {
  const [search, setSearch] = useState('');
  const deferredSearch = useDeferredValue(search);
  const [draftKeys, setDraftKeys] = useState<Set<string> | undefined>(undefined);
  const virtualizedOptionListHandle = useRef<VirtualizedOptionListHandle>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const scrolledRef = useRef<number>(null);
  const savedScrollTopRef = useRef<number | null>(null);

  const currentKeys = useMemo(() => new Set(value.map(valueKey)), [value, valueKey]);

  const filterRegex = useMemo(() => stringToRegExp(deferredSearch), [deferredSearch]);

  const filteredOptions = useMemo(() => {
    if (deferredSearch.length === 0) {
      return options;
    }

    return options.filter((o) => filterRegex.test(filterText(o)));
  }, [options, deferredSearch, filterRegex, filterText]);

  const { highlightedIndex, setHighlightedIndex, highlightedIndexRef } = useHighlight(deferredSearch);

  const { open, buttonRef, handleClose, handleButtonClick, onButtonKeyDown } = usePopoverState({
    onOpen: () => {
      savedScrollTopRef.current = scrollContainerRef?.current?.scrollTop ?? null;
      setSearch('');
      setHighlightedIndex(0);
      setDraftKeys(undefined);

      requestAnimationFrame(() => {
        scrolledRef.current = scrollPopoverIntoView(scrollContainerRef, popoverRef);
      });
    },
    onClose: () => {
      setDraftKeys(undefined);

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

  const activeKeys = draftKeys ?? currentKeys;

  const hasDraftChange = draftKeys !== undefined && !setsEqual(draftKeys, currentKeys);

  const filteredSelectedCount = filteredOptions.filter((o) => activeKeys.has(valueKey(o))).length;
  const anyFilteredSelected = filteredSelectedCount !== 0;

  const toggleOption = useCallback(
    (option: T) => {
      const key = valueKey(option);

      setDraftKeys((prev) => {
        const base = prev ?? new Set(currentKeys);
        const next = new Set(base);

        if (next.has(key)) {
          next.delete(key);
        } else {
          next.add(key);
        }

        return next;
      });
    },
    [valueKey, currentKeys],
  );

  const confirmDraft = useCallback(() => {
    if (draftKeys === undefined || setsEqual(draftKeys, currentKeys)) {
      return;
    }

    const selectedOptions = options.filter((o) => draftKeys.has(valueKey(o)));
    onChange(selectedOptions);
  }, [draftKeys, currentKeys, options, valueKey, onChange]);

  const draftKeysRef = useRef<Set<string> | undefined>(undefined);
  draftKeysRef.current = draftKeys;

  const confirmAndClose = useCallback(() => {
    if (!requireConfirmation && draftKeysRef.current !== undefined && !setsEqual(draftKeysRef.current, currentKeys)) {
      const selected = options.filter((o) => draftKeysRef.current?.has(valueKey(o)) === true);
      onChange(selected);
    }

    handleClose();
  }, [currentKeys, options, valueKey, onChange, handleClose, requireConfirmation]);

  const handleConfirm = useCallback(() => {
    confirmDraft();
    confirmAndClose();
  }, [confirmDraft, confirmAndClose]);

  const selectAll = useCallback(() => {
    const allKeys = new Set(filteredOptions.map(valueKey));

    setDraftKeys((prev) => {
      const base = prev ?? new Set(currentKeys);
      const next = new Set(base);

      for (const key of allKeys) {
        next.add(key);
      }

      return next;
    });
  }, [filteredOptions, valueKey, currentKeys]);

  const deselectAll = useCallback(() => {
    const allFilteredKeys = new Set(filteredOptions.map(valueKey));

    setDraftKeys((prev) => {
      const base = prev ?? new Set(currentKeys);
      const next = new Set(base);

      for (const key of allFilteredKeys) {
        next.delete(key);
      }

      return next;
    });
  }, [filteredOptions, valueKey, currentKeys]);

  const toggleAll = useCallback(() => {
    if (anyFilteredSelected) {
      deselectAll();
    } else {
      selectAll();
    }
  }, [anyFilteredSelected, deselectAll, selectAll]);

  const toggleHighlighted = useCallback(() => {
    const idx = highlightedIndexRef.current;

    if (idx >= 0 && idx < filteredOptions.length) {
      const option = filteredOptions[idx];

      if (option !== undefined) {
        toggleOption(option);
      }
    }
  }, [filteredOptions, toggleOption, highlightedIndexRef]);

  const scrollToIndex = useCallback((index: number) => {
    virtualizedOptionListHandle.current?.scrollToIndex(index);
  }, []);

  const handleNavigation = useKeyboardNavigation({
    filteredOptionsLength: filteredOptions.length,
    setHighlightedIndex,
    onEscape: handleClose,
    scrollToIndex,
  });

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === Keys.Enter && isMetaKey(e)) {
        e.preventDefault();
        confirmAndClose();

        return;
      }

      if (handleNavigation(e)) {
        return;
      }

      switch (e.key) {
        case Keys.Enter: {
          e.preventDefault();
          toggleHighlighted();
          break;
        }
      }
    },
    [handleNavigation, toggleHighlighted, confirmAndClose],
  );

  const filteredKeySet = useMemo(() => new Set(filteredOptions.map(valueKey)), [filteredOptions, valueKey]);

  const handleCheckboxGroupChange = useCallback(
    (newValues: string[]) => {
      const newSet = new Set(newValues);

      // Preserve selections for options that are not currently visible due to filtering.
      for (const key of activeKeys) {
        if (!filteredKeySet.has(key)) {
          newSet.add(key);
        }
      }

      setDraftKeys(newSet);
    },
    [activeKeys, filteredKeySet],
  );

  const activeKeysArray = useMemo(() => [...activeKeys], [activeKeys]);

  return (
    <SelectPopover
      id={id}
      label={label}
      style={style}
      open={open}
      disabled={disabled}
      error={error}
      search={search}
      onSearchChange={setSearch}
      buttonRef={buttonRef}
      popoverRef={popoverRef}
      onButtonClick={handleButtonClick}
      onButtonKeyDown={onButtonKeyDown}
      onClose={confirmAndClose}
      onPopoverKeyDown={handleKeyDown}
      hasDraftChange={hasDraftChange}
      confirmLabel={confirmLabel}
      onConfirm={handleConfirm}
      showConfirm={requireConfirmation}
      keyboardShortcuts={KEYBOARD_SHORTCUTS}
      trigger={
        <TriggerContent
          display={triggerDisplay}
          value={value}
          valueKey={valueKey}
          formatOption={formatOption}
          emptyLabel={emptyLabel}
        />
      }
      flip={flip}
      triggerSize={triggerSize}
      triggerVariant={triggerVariant}
    >
      {filteredOptions.length === 0 ? (
        <div className="px-3 py-2 italic">Ingen treff</div>
      ) : (
        <>
          <CheckboxGroup
            legend={label}
            hideLegend
            size="small"
            value={activeKeysArray}
            onChange={handleCheckboxGroupChange}
            aria-setsize={filteredOptions.length}
            tabIndex={-1}
          >
            <VirtualizedOptionList
              enabled={open}
              options={filteredOptions}
              optionKey={valueKey}
              highlightedIndex={highlightedIndex}
              onHighlight={setHighlightedIndex}
              handleRef={virtualizedOptionListHandle}
              renderOption={(option) => (
                <Checkbox value={valueKey(option)} className="w-full overflow-clip py-1.5" tabIndex={-1}>
                  {formatOption(option)}
                </Checkbox>
              )}
            />
          </CheckboxGroup>

          {showSelectAll ? (
            <Button
              variant="secondary"
              size="xsmall"
              data-color="neutral"
              onClick={toggleAll}
              icon={anyFilteredSelected ? <XMarkIcon aria-hidden /> : <CheckmarkIcon aria-hidden />}
            >
              {anyFilteredSelected ? `Fjern alle (${filteredSelectedCount})` : `Velg alle (${filteredOptions.length})`}
            </Button>
          ) : null}
        </>
      )}
    </SelectPopover>
  );
};
