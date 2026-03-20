import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons';
import {
  Box,
  Button,
  type ButtonProps,
  InlineMessage,
  Popover,
  Tag,
  TextField,
  Tooltip,
  VStack,
} from '@navikt/ds-react';
import type { ReactNode, RefObject } from 'react';
import { useEffect, useId, useRef } from 'react';
import { KeyRow } from '@/components/searchable-select/key-row';
import { Keys, MOD_KEY_TEXT } from '@/keys';

interface KeyboardShortcut {
  shortcuts: string[];
  description: string;
}

interface SelectPopoverProps {
  /** Optional id applied to the trigger button, enabling external `<label htmlFor={id}>` association. */
  id?: string;
  label: string;
  open: boolean;
  disabled: boolean;
  error?: string;
  search: string;
  onSearchChange: (value: string) => void;
  buttonRef: RefObject<HTMLButtonElement | null>;
  popoverRef?: RefObject<HTMLDivElement | null>;
  onButtonClick: () => void;
  onButtonKeyDown: (e: React.KeyboardEvent) => void;
  onClose: () => void;
  onPopoverKeyDown: (e: React.KeyboardEvent) => void;
  hasDraftChange: boolean;
  confirmLabel: string;
  onConfirm: () => void;
  /** Whether to show the confirm button and its keyboard shortcut row. Defaults to `true`. */
  showConfirm?: boolean;
  keyboardShortcuts: KeyboardShortcut[];
  /** The trigger button content. */
  trigger: ReactNode;
  /** Whether the popover should flip its placement when it reaches the viewport edge. */
  flip?: boolean;
  /** Size of the trigger button. Defaults to `"small"`. */
  triggerSize?: ButtonProps['size'];
  /** Variant of the trigger button. Defaults to `"secondary"`. */
  triggerVariant?: ButtonProps['variant'];
  /** Inline styles applied to the outermost wrapper element. */
  style?: React.CSSProperties;
  /** The option list (CheckboxGroup / RadioGroup). */
  children: ReactNode;
}

export const SelectPopover = ({
  id,
  label,
  open,
  disabled,
  error,
  search,
  onSearchChange,
  buttonRef,
  popoverRef,
  onButtonClick,
  onButtonKeyDown,
  onClose,
  onPopoverKeyDown,
  hasDraftChange,
  confirmLabel,
  onConfirm,
  showConfirm = true,
  keyboardShortcuts,
  trigger,
  flip,
  triggerSize = 'small',
  triggerVariant = 'secondary',
  style,
  children,
}: SelectPopoverProps) => {
  const searchRef = useRef<HTMLInputElement>(null);
  const popoverId = useId();

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => {
        searchRef.current?.focus();
      });
    }
  }, [open]);

  const triggerWidth = triggerVariant === 'tertiary' ? 'w-fit' : 'w-full';

  return (
    <VStack gap="space-4" width="100%" style={style}>
      <Button
        id={id}
        ref={buttonRef}
        type="button"
        variant={triggerVariant}
        data-color="neutral"
        size={triggerSize}
        onClick={onButtonClick}
        onKeyDown={(e) => {
          if (e.key === Keys.ArrowDown || e.key === Keys.ArrowUp) {
            e.preventDefault();
          }
          onButtonKeyDown(e);
        }}
        disabled={disabled}
        iconPosition="right"
        icon={open ? <ChevronUpIcon aria-hidden /> : <ChevronDownIcon aria-hidden />}
        className={`flex min-h-8 cursor-pointer items-center justify-between gap-1 ${triggerWidth}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label}
        aria-controls={open ? popoverId : undefined}
      >
        {trigger}
      </Button>

      {typeof error === 'string' && error.length > 0 ? (
        <InlineMessage size="small" status="error">
          {error}
        </InlineMessage>
      ) : null}

      <Popover
        ref={popoverRef}
        id={popoverId}
        open={open}
        onClose={onClose}
        anchorEl={buttonRef.current}
        placement="bottom-start"
        offset={0}
        tabIndex={-1}
        onKeyDown={onPopoverKeyDown}
        flip={flip}
      >
        <Popover.Content className="flex flex-col gap-2">
          <TextField
            ref={searchRef}
            size="small"
            label={label}
            hideLabel
            placeholder="Filtrer..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            autoComplete="off"
          />

          {children}

          {showConfirm ? (
            <Tooltip content={confirmLabel} keys={[MOD_KEY_TEXT, 'Enter']}>
              <Button
                size="small"
                variant={hasDraftChange ? 'primary' : 'secondary-neutral'}
                onClick={onConfirm}
                disabled={!hasDraftChange}
                className="w-full"
              >
                <div className="flex gap-2">
                  <span>{confirmLabel}</span>

                  <Tag variant="strong" data-color="neutral" size="xsmall">
                    {CONFIRM_SHORTCUT}
                  </Tag>
                </div>
              </Button>
            </Tooltip>
          ) : null}

          <Box
            as="dl"
            background="neutral-soft"
            borderRadius="8"
            paddingBlock="space-8"
            paddingInline="space-16"
            marginInline="auto"
            width="fit"
            className="grid grid-cols-[auto_1fr] items-center gap-x-3 text-ax-text-subtle"
          >
            <KeyRow shortcuts={['↑', '↓']} description="Naviger" />
            {keyboardShortcuts.map(({ shortcuts, description }) => (
              <KeyRow key={shortcuts.join('+')} shortcuts={shortcuts} description={description} />
            ))}
            {showConfirm ? <KeyRow shortcuts={[CONFIRM_SHORTCUT]} description={confirmLabel} /> : null}
            <KeyRow shortcuts={['Esc']} description="Lukk" />
          </Box>
        </Popover.Content>
      </Popover>
    </VStack>
  );
};

const CONFIRM_SHORTCUT = `${MOD_KEY_TEXT} + Enter`;
