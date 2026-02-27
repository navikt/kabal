import { isMetaKey, Keys, MOD_KEY_TEXT } from '@app/keys';
import { CheckmarkIcon, ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons';
import { BodyShort, Box, Button, InlineMessage, Popover, TextField, Tooltip, VStack } from '@navikt/ds-react';
import { type ReactNode, useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';

const NULL_KEY = '__searchable_select_null__';

interface SearchableSelectProps<T> {
  /** Used for aria-label on the trigger button and internal fields. Not rendered visually. */
  label: string;
  options: T[];
  value: T | null;
  valueKey: (option: T) => string;
  formatLabel: (option: T | null) => ReactNode;
  filterOption: (option: T, search: string) => boolean;
  onChange: (value: T) => void;
  onClear?: () => void;
  disabled?: boolean;
  size?: 'small' | 'medium';
  error?: string;
  confirmLabel: string;
}

export const SearchableSelect = <T,>({
  label,
  options,
  value,
  valueKey,
  formatLabel,
  filterOption,
  onChange,
  onClear,
  disabled = false,
  size = 'small',
  error,
  confirmLabel,
}: SearchableSelectProps<T>) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  // undefined = no pending change, null = pending clear, T = pending selection.
  const [pendingValue, setPendingValue] = useState<T | null | undefined>(undefined);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const highlightedIndexRef = useRef(-1);

  // Keep ref in sync with state.
  highlightedIndexRef.current = highlightedIndex;

  const getKey = (option: T | null): string => (option === null ? NULL_KEY : valueKey(option));

  // The null option is always visible (not filtered); only T options are filtered.
  const filteredOptions: (T | null)[] = useMemo(() => {
    const nullOption: (T | null)[] = onClear !== undefined ? [null] : [];
    const filtered = search.length === 0 ? options : options.filter((o) => filterOption(o, search));

    return [...nullOption, ...filtered];
  }, [onClear, options, search, filterOption]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: search is intentionally a dependency to trigger highlight reset on search change
  useEffect(() => {
    setHighlightedIndex(-1);
  }, [search]);

  const handleOpen = useCallback(() => {
    setOpen(true);
    setSearch('');
    setHighlightedIndex(-1);
    setPendingValue(undefined);
  }, []);

  const closedByPopoverRef = useRef(false);

  const handleClose = useCallback(() => {
    setOpen(false);
    setPendingValue(undefined);
    closedByPopoverRef.current = true;
    // Clear flag after the current event cycle so it only blocks
    // the click that triggered the close (mousedown→onClose→mouseup→onClick race).
    requestAnimationFrame(() => {
      closedByPopoverRef.current = false;
    });
    buttonRef.current?.focus();
  }, []);

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

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === Keys.Enter && isMetaKey(e)) {
        e.preventDefault();
        confirmPending(pendingValueRef.current);
        handleClose();

        return;
      }

      switch (e.key) {
        case Keys.ArrowDown: {
          e.preventDefault();
          setHighlightedIndex((prev) => {
            const next = prev < filteredOptions.length - 1 ? prev + 1 : 0;
            scrollItemIntoView(listRef.current, next);

            return next;
          });
          break;
        }
        case Keys.ArrowUp: {
          e.preventDefault();
          setHighlightedIndex((prev) => {
            const next = prev > 0 ? prev - 1 : filteredOptions.length - 1;
            scrollItemIntoView(listRef.current, next);

            return next;
          });
          break;
        }
        case Keys.Enter: {
          e.preventDefault();
          const idx = highlightedIndexRef.current;

          if (idx >= 0 && idx < filteredOptions.length) {
            const option = filteredOptions[idx];

            if (option !== undefined) {
              setPendingValue(option);
            }
          }
          break;
        }
        case Keys.Escape: {
          e.preventDefault();
          handleClose();
          break;
        }
        case Keys.Home: {
          e.preventDefault();
          setHighlightedIndex(0);
          scrollItemIntoView(listRef.current, 0);
          break;
        }
        case Keys.End: {
          e.preventDefault();
          const last = filteredOptions.length - 1;
          setHighlightedIndex(last);
          scrollItemIntoView(listRef.current, last);
          break;
        }
      }
    },
    [filteredOptions, confirmPending, handleClose],
  );

  const handleButtonClick = useCallback(() => {
    // When the Popover's onClose fires (mousedown outside, e.g. on this button),
    // the subsequent click event should not re-open the popover.
    if (closedByPopoverRef.current) {
      closedByPopoverRef.current = false;

      return;
    }

    if (open) {
      handleClose();
    } else {
      handleOpen();
    }
  }, [open, handleClose, handleOpen]);

  const onButtonKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === Keys.ArrowDown || e.key === Keys.ArrowUp) {
        e.preventDefault();
        handleOpen();
      }
    },
    [handleOpen],
  );

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => {
        searchRef.current?.focus();
      });
    }
  }, [open]);

  const currentKey = getKey(value);
  const hasPendingChange = pendingValue !== undefined && !optionsMatch(pendingValue, value, valueKey);
  const displayKey = pendingValue !== undefined ? getKey(pendingValue) : currentKey;
  const confirmShortcut = `${MOD_KEY_TEXT} + Enter`;

  const popoverId = useId();

  return (
    <VStack gap="space-4">
      <Button
        ref={buttonRef}
        type="button"
        variant="secondary-neutral"
        size={size}
        onClick={handleButtonClick}
        onKeyDown={onButtonKeyDown}
        disabled={disabled}
        icon={open ? <ChevronUpIcon aria-hidden /> : <ChevronDownIcon aria-hidden />}
        iconPosition="right"
        className="justify-between!"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label}
        aria-controls={open ? popoverId : undefined}
      >
        {formatLabel(value)}
      </Button>

      {typeof error === 'string' && error.length > 0 ? (
        <InlineMessage size={size} status="error">
          {error}
        </InlineMessage>
      ) : null}

      <Popover
        id={popoverId}
        open={open}
        onClose={handleClose}
        anchorEl={buttonRef.current}
        placement="bottom-start"
        offset={0}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
      >
        <Popover.Content className="flex flex-col gap-2">
          <TextField
            ref={searchRef}
            size="small"
            label={label}
            hideLabel
            placeholder="Filtrer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
            autoComplete="off"
          />

          <div ref={listRef} role="listbox" aria-label={label} className="flex max-h-100 flex-col overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-2 italic">Ingen treff</div>
            ) : (
              filteredOptions.map((option, index) => {
                const optionKey = getKey(option);
                const isCommitted = optionKey === currentKey;
                const isPending = hasPendingChange && pendingValue !== undefined && optionKey === getKey(pendingValue);
                const isSelected = optionKey === displayKey;
                const isHighlighted = index === highlightedIndex;

                return (
                  <div
                    key={optionKey}
                    role="option"
                    tabIndex={-1}
                    aria-selected={isSelected}
                    data-highlighted={isHighlighted}
                    className={`flex cursor-pointer items-center gap-2 rounded-sm px-3 py-2 ${getOptionClassName(isHighlighted, isPending, isCommitted)}`}
                    onClick={() => setPendingValue(option)}
                    onKeyDown={(e) => {
                      if (e.key === Keys.Enter || e.key === Keys.Space) {
                        e.preventDefault();
                        setPendingValue(option);
                      }
                    }}
                    onMouseEnter={() => setHighlightedIndex(index)}
                  >
                    <span className="inline-flex w-5 shrink-0">
                      {isSelected ? <CheckmarkIcon aria-hidden fontSize="1.25rem" /> : null}
                    </span>
                    {formatLabel(option)}
                  </div>
                );
              })
            )}
          </div>

          <Tooltip content={confirmLabel} keys={[MOD_KEY_TEXT, 'Enter']}>
            <Button
              size="small"
              variant={hasPendingChange ? 'primary' : 'secondary-neutral'}
              onClick={handleConfirm}
              disabled={!hasPendingChange}
              className="w-full"
              icon={<CheckmarkIcon aria-hidden />}
            >
              {confirmLabel}
            </Button>
          </Tooltip>

          <Box
            background="neutral-soft"
            borderRadius="8"
            paddingBlock="space-8"
            paddingInline="space-16"
            marginInline="auto"
            width="fit"
            className="grid grid-cols-[auto_1fr] items-center gap-x-3 text-ax-text-subtle"
          >
            <KeyRow shortcuts={['↑', '↓']} description="Naviger" />
            <KeyRow shortcuts={['Enter']} description="Velg" />
            <KeyRow shortcuts={[confirmShortcut]} description={confirmLabel} />
            <KeyRow shortcuts={['Esc']} description="Lukk" />
          </Box>
        </Popover.Content>
      </Popover>
    </VStack>
  );
};

const HIGHLIGHT = 'bg-ax-bg-accent-moderate ring-2 ring-ax-border-accent ring-inset';
const COMMITTED = 'border-l-[3px] border-ax-border-accent';

const getOptionClassName = (isHighlighted: boolean, isPending: boolean, isCommitted: boolean): string => {
  if (isPending && isHighlighted) {
    return `${HIGHLIGHT} bg-ax-bg-accent-strong text-ax-text-on-colored`;
  }

  if (isPending) {
    return 'bg-ax-bg-accent-moderate';
  }

  if (isHighlighted) {
    return `${HIGHLIGHT} ${isCommitted ? COMMITTED : ''}`;
  }

  if (isCommitted) {
    return `bg-ax-bg-accent-soft ${COMMITTED}`;
  }

  return '';
};

const optionsMatch = <T,>(a: T | null, b: T | null, vk: (o: T) => string): boolean => {
  if (a === null) {
    return b === null;
  }

  if (b === null) {
    return false;
  }

  return vk(a) === vk(b);
};

const scrollItemIntoView = (list: HTMLDivElement | null, index: number) => {
  if (list === null) {
    return;
  }

  const item = list.children[index];

  if (item instanceof HTMLElement) {
    item.scrollIntoView({ block: 'nearest' });
  }
};

interface KeyRowProps {
  shortcuts: string[];
  description: string;
}

const KeyRow = ({ shortcuts, description }: KeyRowProps) => (
  <>
    <span className="flex flex-row gap-2 py-0.5">
      {shortcuts.map((s) => (
        <kbd
          key={s}
          className="inline-block rounded-sm bg-ax-bg-neutral-moderate px-1.5 py-0.5 text-center font-mono text-small"
        >
          {s}
        </kbd>
      ))}
    </span>

    <BodyShort size="small" className="py-0.5">
      {description}
    </BodyShort>
  </>
);
