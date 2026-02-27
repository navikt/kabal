import { scrollPopoverIntoView } from '@app/components/searchable-select/scroll-popover-into-view';
import { optionsMatch } from '@app/components/searchable-select/searchable-single-select/single-select-utils';
import { NULL_KEY, type SearchableSelectProps } from '@app/components/searchable-select/searchable-single-select/types';
import { SelectPopover } from '@app/components/searchable-select/select-popover';
import { useHighlight } from '@app/components/searchable-select/use-highlight';
import { useKeyboardNavigation } from '@app/components/searchable-select/use-keyboard-navigation';
import { usePopoverState } from '@app/components/searchable-select/use-popover-state';
import {
  VirtualizedOptionList,
  type VirtualizedOptionListHandle,
} from '@app/components/searchable-select/virtualized-option-list';
import { isMetaKey, Keys } from '@app/keys';
import { Radio, RadioGroup } from '@navikt/ds-react';
import { useCallback, useDeferredValue, useMemo, useRef, useState } from 'react';

const KEYBOARD_SHORTCUTS = [{ shortcuts: ['Enter'], description: 'Velg' }];

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
  flip,
  scrollContainerRef,
  triggerSize,
  triggerVariant,
  style,
}: SearchableSelectProps<T>) => {
  const [search, setSearch] = useState('');
  const deferredSearch = useDeferredValue(search);
  const [pendingValue, setPendingValue] = useState<T | null | undefined>(undefined);
  const virtualizedOptionListHandle = useRef<VirtualizedOptionListHandle>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const scrolledRef = useRef<number>(null);
  const savedScrollTopRef = useRef<number | null>(null);

  const { highlightedIndex, setHighlightedIndex, highlightedIndexRef } = useHighlight(deferredSearch);

  const { open, buttonRef, handleClose, handleButtonClick, onButtonKeyDown } = usePopoverState({
    onOpen: () => {
      savedScrollTopRef.current = scrollContainerRef?.current?.scrollTop ?? null;
      setSearch('');
      setHighlightedIndex(0);
      setPendingValue(undefined);

      requestAnimationFrame(() => {
        scrolledRef.current = scrollPopoverIntoView(scrollContainerRef, popoverRef);
      });
    },
    onClose: () => {
      setPendingValue(undefined);

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

  const getKey = (option: T | null): string => (option === null ? NULL_KEY : valueKey(option));

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

  const confirmPending = useCallback(
    (pending: T | null | undefined) => {
      if (pending !== undefined && !optionsMatch(pending, value, valueKey)) {
        if (pending === null) {
          onClear?.();
        } else {
          onChange(pending);
        }
      }
    },
    [value, onChange, onClear, valueKey],
  );

  const handleConfirm = useCallback(() => {
    confirmPending(pendingValue);
    handleClose();
  }, [pendingValue, confirmPending, handleClose]);

  const pendingValueRef = useRef<T | null | undefined>(undefined);
  pendingValueRef.current = pendingValue;

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
        confirmPending(pendingValueRef.current);
        handleClose();

        return;
      }

      if (handleNavigation(e)) {
        return;
      }

      if (e.key === Keys.Enter) {
        e.preventDefault();
        const idx = highlightedIndexRef.current;

        if (idx >= 0 && idx < filteredOptions.length) {
          const option = filteredOptions[idx];

          if (option !== undefined) {
            setPendingValue(option);
          }
        }
      }
    },
    [filteredOptions, confirmPending, handleClose, handleNavigation, highlightedIndexRef],
  );

  const handleRadioGroupChange = useCallback(
    (newValue: string) => {
      if (newValue === NULL_KEY) {
        setPendingValue(null);
      } else {
        const option = optionsByKey.get(newValue);

        if (option !== undefined) {
          setPendingValue(option);
        }
      }
    },
    [optionsByKey],
  );

  const hasPendingChange = pendingValue !== undefined && !optionsMatch(pendingValue, value, valueKey);
  const displayKey = pendingValue !== undefined ? getKey(pendingValue) : getKey(value);

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
      hasPendingChange={hasPendingChange}
      confirmLabel={confirmLabel}
      onConfirm={handleConfirm}
      keyboardShortcuts={KEYBOARD_SHORTCUTS}
      flip={flip}
      trigger={formatLabel(value)}
      triggerSize={triggerSize}
      triggerVariant={triggerVariant}
      style={style}
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
            renderOption={(option) => (
              <Radio value={getKey(option)} className="w-full">
                {formatLabel(option)}
              </Radio>
            )}
          />
        </RadioGroup>
      )}
    </SelectPopover>
  );
};
