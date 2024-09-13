import { useOnClickOutside } from '@app/hooks/use-on-click-outside';
import { CalendarIcon } from '@navikt/aksel-icons';
import { Alert, Button, type ButtonProps, DatePicker } from '@navikt/ds-react';
import { format, formatISO, parseISO } from 'date-fns';
import { useCallback, useMemo, useRef, useState } from 'react';
import type { DateRange } from 'react-day-picker';
import { styled } from 'styled-components';

type DateStringISO = string;

interface Props {
  selected: {
    from?: DateStringISO;
    to?: DateStringISO;
  };
  onChange: (date: DateRange | undefined) => void;
  buttonLabel?: string;
  gridArea?: string;
  ButtonComponent?: React.ComponentType<ButtonProps>;
  neutral?: boolean;
}

export const DatePickerRange = ({
  onChange,
  selected,
  buttonLabel,
  gridArea,
  ButtonComponent = Button,
  neutral = false,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const onClick = useCallback(() => setIsOpen((o) => !o), []);
  const ref = useRef(null);

  useOnClickOutside(ref, () => setIsOpen(false));

  const from = typeof selected.from === 'undefined' ? undefined : parseISO(selected.from);
  const to = typeof selected.to === 'undefined' ? undefined : parseISO(selected.to);

  const active = from !== undefined || to !== undefined;

  const variant: ButtonProps['variant'] = useMemo(() => {
    if (neutral) {
      return active ? 'primary-neutral' : 'tertiary-neutral';
    }

    return active ? 'primary' : 'tertiary';
  }, [active, neutral]);

  return (
    <Container ref={ref} $gridArea={gridArea}>
      <ButtonComponent onClick={onClick} size="small" variant={variant} icon={<CalendarIcon aria-hidden />}>
        {buttonLabel}
      </ButtonComponent>
      {isOpen ? (
        <DatepickerContainer>
          <StyledButtons>
            <Button size="small" variant="primary" onClick={() => setIsOpen(false)}>
              Lukk
            </Button>
            <Button
              size="small"
              variant="secondary"
              onClick={() => {
                onChange(undefined);
                setIsOpen(false);
              }}
            >
              Nullstill
            </Button>
          </StyledButtons>
          <StyledDateRange>{formatDateRange(from, to)}</StyledDateRange>
          <DatePicker.Standalone selected={{ from, to }} mode="range" onSelect={onChange} />
        </DatepickerContainer>
      ) : null}
    </Container>
  );
};

const formatDateRange = (from: Date | undefined, to: Date | undefined) => {
  if (from === undefined || to === undefined) {
    return (
      <Alert size="small" variant="info" inline>
        Ingen periode valgt
      </Alert>
    );
  }

  return (
    <>
      <Time date={from} /> - <Time date={to} />
    </>
  );
};

interface TimeProps {
  date: Date;
}

const Time = ({ date }: TimeProps) => (
  <time dateTime={formatISO(date, { representation: 'date' })}>{format(date, 'dd.MM.yyyy')}</time>
);

const Container = styled.div<{ $gridArea?: string }>`
  position: relative;
  height: var(--a-spacing-8);
  grid-area: ${({ $gridArea }) => $gridArea};
`;

const DatepickerContainer = styled.div`
  position: absolute;
  right: 0;
  top: 100%;
  z-index: 1;
  background-color: var(--a-surface-default);
  border-radius: var(--a-border-radius-medium);
  box-shadow: 0px var(--a-spacing-1) var(--a-spacing-2) rgba(0, 0, 0, 0.1);
  font-weight: initial;
`;

const StyledButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: var(--a-spacing-3);
  column-gap: var(--a-spacing-3);
`;

const StyledDateRange = styled.div`
  height: var(--a-spacing-8);
  width: 100%;
  padding-left: var(--a-spacing-3);
  padding-right: var(--a-spacing-3);
`;
