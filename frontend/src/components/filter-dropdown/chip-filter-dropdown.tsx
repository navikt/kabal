import { Popup, type PopupProps } from '@app/components/filter-dropdown/popup';
import { useOnClickOutside } from '@app/hooks/use-on-click-outside';
import { ChevronDownIcon } from '@navikt/aksel-icons';
import { Box, Button, Chips, HGrid } from '@navikt/ds-react';
import { useRef, useState } from 'react';
import { Dropdown } from './dropdown';
import type { BaseProps } from './props';

interface FilterDropdownProps<T extends string> extends BaseProps<T> {
  children: string;
  direction?: PopupProps['direction'];
  maxWidth?: PopupProps['maxWidth'];
  maxHeight?: PopupProps['maxHeight'];
  className?: string;
}

export const ChipFilterDropdown = <T extends string>({
  options,
  selected,
  onChange,
  direction,
  maxHeight,
  maxWidth,
  children,
}: FilterDropdownProps<T>): React.JSX.Element => {
  const [open, setOpen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(containerRef, () => setOpen(false), true);

  const close = () => {
    buttonRef.current?.focus();
    boxRef.current?.focus();
    setOpen(false);
  };

  const chevron = <ChevronDownIcon aria-hidden fontSize={24} />;

  const shadow = open ? 'shadow-[var(--a-shadow-focus)]' : 'shadow-none';

  return (
    <div className="relative" ref={containerRef}>
      {selected.length === 0 ? (
        <Button
          ref={buttonRef}
          size="small"
          iconPosition="right"
          icon={<ChevronDownIcon aria-hidden fontSize={24} />}
          onClick={() => setOpen(!open)}
          variant="secondary-neutral"
          className={`${shadow} hover:!border-[var(--a-border-action)] w-full justify-between border-1 pl-2 hover:bg-transparent active:text-[var(--a-text-default)]`}
          style={{ borderColor: 'var(--a-border-default)', paddingRight: 7.5 }}
        >
          <span className="font-normal">{children}</span>
        </Button>
      ) : (
        <Box
          ref={boxRef}
          borderRadius="medium"
          borderColor="border-default"
          borderWidth="1"
          className={`${shadow} cursor-pointer pl-1 hover:border-[var(--a-border-action)]`}
          onClick={() => setOpen(!open)}
        >
          <HGrid columns="auto min-content">
            <Chips size="small" className="py-1">
              {selected.map((id) => (
                <Chips.Removable
                  key={id}
                  variant="action"
                  onClick={(e) => e.stopPropagation()}
                  onDelete={() => onChange(selected.filter((s) => s !== id))}
                >
                  {options.find((option) => option.value === id)?.label ?? id}
                </Chips.Removable>
              ))}
            </Chips>

            <Button
              onClick={() => setOpen(!open)}
              variant="tertiary-neutral"
              size="small"
              className="hover:bg-transparent focus:shadow-none"
              style={{ paddingRight: 5.5, paddingLeft: 5.5 }}
            >
              {chevron}
            </Button>
          </HGrid>
        </Box>
      )}

      <Popup isOpen={open} direction={direction} maxWidth={maxWidth} maxHeight={maxHeight}>
        <Dropdown selected={selected} options={options} onChange={onChange} close={close} />
      </Popup>
    </div>
  );
};
