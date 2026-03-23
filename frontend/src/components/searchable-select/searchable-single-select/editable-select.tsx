import { Radio, RadioGroup } from '@navikt/ds-react';
import { useCallback, useDeferredValue, useId, useMemo, useRef, useState } from 'react';
import { scrollPopoverIntoView } from '@/components/searchable-select/scroll-popover-into-view';
import { optionsMatch } from '@/components/searchable-select/searchable-single-select/single-select-utils';
import { NULL_KEY, type SearchableSelectProps } from '@/components/searchable-select/searchable-single-select/types';
import { SelectPopover } from '@/components/searchable-select/select-popover';
import { useHighlight } from '@/components/searchable-select/use-highlight';
import { useKeyboardNavigation } from '@/components/searchable-select/use-keyboard-navigation';
import { usePopoverState } from '@/components/searchable-select/use-popover-state';
import {
  getOptionId,
  VirtualizedOptionList,
  type VirtualizedOptionListHandle,
} from '@/components/searchable-select/virtualized-option-list';
import { isMetaKey, Keys } from '@/keys';

const CONFIRM_KEYBOARD_SHORTCUTS = [{ shortcuts: ['Enter'], description: 'Velg' }];

export const EditableSelect = <T,>({
  id,
  label,
  options,
  value,
  valueKey,
  formatLabel,
  filterOption,
  onChange,
  onClear,
  disabled = false,
  error,
  confirmLabel,
  requireConfirmation = false,
  flip,
  scrollContainerRef,
  triggerSize,
  triggerVariant,
  style,
}: SearchableSelectProps<T>) => {
  const [search, setSearch] = useState('');
  const deferredSearch = useDeferredValue(search);
  const [draftValue, setDraftValue] = useState<T | null | undefined>(undefined);
  const virtualizedOptionListHandle = useRef<VirtualizedOptionListHandle>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const scrolledRef = useRef<number>(null);
  const savedScrollTopRef = useRef<number | null>(null);

  const draftValueRef = useRef<T | null | undefined>(undefined);
  draftValueRef.current = draftValue;

  const listboxId = useId();

  const { highlightedIndex, setHighlightedIndex, highlightedIndexRef } = useHighlight(deferredSearch);

  const confirmDraft = useCallback(
    (draft: T | null | undefined) => {
      if (draft === undefined || optionsMatch(draft, value, valueKey)) {
        return;
      }

      if (draft === null) {
        onClear?.();
      } else {
        onChange(draft);
      }
    },
    [value, onChange, onClear, valueKey],
  );

  const { open, buttonRef, handleClose, handleButtonClick, onButtonKeyDown } = usePopoverState({
    onOpen: () => {
      savedScrollTopRef.current = scrollContainerRef?.current?.scrollTop ?? null;
      setSearch('');
      setHighlightedIndex(0);
      setDraftValue(undefined);

      requestAnimationFrame(() => {
        scrolledRef.current = scrollPopoverIntoView(scrollContainerRef, popoverRef);
      });
    },
    onClose: () => {
      if (!requireConfirmation) {
        confirmDraft(draftValueRef.current);
      }

      setDraftValue(undefined);

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

  const getKey = useCallback((option: T | null): string => (option === null ? NULL_KEY : valueKey(option)), [valueKey]);

  const optionsByKey = useMemo(() => {
    const map = new Map<string, T>();

    for (const option of options) {
      map.set(valueKey(option), option);
    }

    return map;
  }, [options, valueKey]);

  const filteredOptions: (T | null)[] = useMemo(() => {
    const nullOption: (T | null)[] = onClear !== undefined ? [null] : [];
    const filtered = deferredSearch.length === 0 ? options : options.filter((o) => filterOption(o, deferredSearch));

    return [...nullOption, ...filtered];
  }, [onClear, options, deferredSearch, filterOption]);

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
    (filteredOptions: (T | null)[]) => {
      const idx = highlightedIndexRef.current;

      if (idx >= 0 && idx < filteredOptions.length) {
        return filteredOptions[idx];
      }
    },
    [highlightedIndexRef],
  );

  const confirmAndClose = useCallback(
    (option: T | null | undefined) => {
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

  const handleRadioGroupChange = useCallback(
    (newValue: string) => {
      if (newValue === NULL_KEY) {
        if (requireConfirmation) {
          setDraftValue(null);
        } else {
          confirmAndClose(null);
        }
      } else {
        const option = optionsByKey.get(newValue);

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
    [optionsByKey, requireConfirmation, confirmAndClose],
  );

  const hasDraftChange = draftValue !== undefined && !optionsMatch(draftValue, value, valueKey);
  const displayKey = draftValue !== undefined ? getKey(draftValue) : getKey(value);

  // Build the set of selected keys for aria-selected on option elements.
  const selectedKeys = useMemo(() => new Set([displayKey]), [displayKey]);

  // Compute the active descendant id for the currently highlighted option.
  const activeDescendantId = useMemo(() => {
    if (highlightedIndex < 0 || highlightedIndex >= filteredOptions.length) {
      return undefined;
    }

    const option = filteredOptions[highlightedIndex];

    if (option === undefined) {
      return undefined;
    }

    return getOptionId(listboxId, getKey(option));
  }, [highlightedIndex, filteredOptions, listboxId, getKey]);

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
        requireConfirmation ? CONFIRM_KEYBOARD_SHORTCUTS : [{ shortcuts: ['Enter'], description: confirmLabel }]
      }
      flip={flip}
      trigger={formatLabel(value)}
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
        <RadioGroup legend={label} hideLegend size="small" value={displayKey} onChange={handleRadioGroupChange}>
          <VirtualizedOptionList
            enabled={open}
            options={filteredOptions}
            optionKey={getKey}
            highlightedIndex={highlightedIndex}
            onHighlight={setHighlightedIndex}
            handleRef={virtualizedOptionListHandle}
            listboxId={listboxId}
            selectedKeys={selectedKeys}
            renderOption={(option) => (
              <Radio value={getKey(option)} className="w-full" tabIndex={-1}>
                {formatLabel(option)}
              </Radio>
            )}
          />
        </RadioGroup>
      )}
    </SelectPopover>
  );
};
