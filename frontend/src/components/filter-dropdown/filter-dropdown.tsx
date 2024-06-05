import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons';
import { useRef, useState } from 'react';
import { styled } from 'styled-components';
import { useOnClickOutside } from '@app/hooks/use-on-click-outside';
import { ToggleButton } from '../toggle-button/toggle-button';
import { Dropdown } from './dropdown';
import { BaseProps } from './props';

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
}: FilterDropdownProps<T>): JSX.Element => {
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

interface PopupProps {
  isOpen: boolean;
  direction: StyledPopupProps['$direction'];
  maxWidth?: StyledPopupProps['$maxWidth'];
  maxHeight?: StyledPopupProps['$maxHeight'];
  children: React.ReactNode;
}

const Popup = ({ isOpen, direction, maxWidth, maxHeight, children }: PopupProps) => {
  if (!isOpen) {
    return null;
  }

  return (
    <StyledPopup $direction={direction} $maxWidth={maxWidth} $maxHeight={maxHeight}>
      {children}
    </StyledPopup>
  );
};

interface StyledPopupProps {
  $direction?: 'left' | 'right';
  $maxWidth?: string;
  $maxHeight?: number;
}

const StyledPopup = styled.div<StyledPopupProps>`
  display: flex;
  position: absolute;
  top: 100%;
  left: ${({ $direction }) => ($direction === 'left' ? 'auto' : '0')};
  right: ${({ $direction }) => ($direction === 'left' ? '0' : 'auto')};
  min-width: 275px;
  max-height: ${({ $maxHeight = 500 }) => $maxHeight}px;
  max-width: ${({ $maxWidth }) => $maxWidth ?? 'unset'};
  z-index: 22;
  background-color: white;
  border-radius: 0.25rem;
  border: 1px solid #c6c2bf;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.3);
`;
