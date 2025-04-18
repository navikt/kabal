import { Popup, type PopupProps } from '@app/components/filter-dropdown/popup';
import { useOnClickOutside } from '@app/hooks/use-on-click-outside';
import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons';
import { useRef, useState } from 'react';
import { styled } from 'styled-components';
import { ToggleButton } from '../toggle-button/toggle-button';
import { Dropdown } from './dropdown';
import type { BaseProps } from './props';

interface FilterDropdownProps<T extends string> extends BaseProps<T> {
  children: string | null;
  'data-testid': string;
  direction?: PopupProps['direction'];
  maxWidth?: PopupProps['maxWidth'];
  maxHeight?: PopupProps['maxHeight'];
  className?: string;
}

export const FilterDropdown = <T extends string>({
  options,
  selected,
  onChange,
  children,
  'data-testid': testId,
  direction,
  maxHeight,
  maxWidth,
  className,
}: FilterDropdownProps<T>): React.JSX.Element => {
  const [open, setOpen] = useState<boolean>(false);
  const ref = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useOnClickOutside(ref, () => setOpen(false), true);

  const close = () => {
    buttonRef.current?.focus();
    setOpen(false);
  };

  const chevron = open ? <ChevronUpIcon aria-hidden fontSize={20} /> : <ChevronDownIcon aria-hidden fontSize={20} />;

  return (
    <Container ref={ref} data-testid={testId} className={className}>
      <ToggleButton $open={open} onClick={() => setOpen(!open)} ref={buttonRef} data-testid="toggle-button">
        {children} ({selected.length}) {chevron}
      </ToggleButton>
      <Popup isOpen={open} direction={direction} maxWidth={maxWidth} maxHeight={maxHeight}>
        <Dropdown selected={selected} options={options} onChange={onChange} close={close} />
      </Popup>
    </Container>
  );
};

const Container = styled.section`
  position: relative;
`;
