import { Filter2, Filter2Filled } from '@navikt/ds-icons';
import { BodyShort, Button, DatePickerProps, UNSAFE_DatePicker as Datepicker } from '@navikt/ds-react';
import { format, formatISO } from 'date-fns';
import React, { useCallback, useRef, useState } from 'react';
import { DateRange } from 'react-day-picker';
import styled from 'styled-components';
import { useOnClickOutside } from '../../../../hooks/use-on-click-outside';

interface Props extends Pick<DatePickerProps, 'fromDate' | 'toDate'> {
  children: React.ReactNode;
  onChange: (value?: DateRange | undefined) => void;
  selected?: DateRange;
}

export const DateFilter = ({ children, onChange, selected, ...datePickerProps }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const onClick = useCallback(() => setIsOpen((o) => !o), [setIsOpen]);
  const ref = useRef(null);

  useOnClickOutside(ref, () => setIsOpen(false));

  const Icon = selected === undefined ? Filter2 : Filter2Filled;

  return (
    <Container ref={ref}>
      <Button onClick={onClick} size="small" variant="tertiary" icon={<Icon aria-hidden />}>
        {children}
      </Button>
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
          <StyledDateRange>{formatDateRange(selected)}</StyledDateRange>
          <Datepicker.Standalone {...datePickerProps} selected={selected} mode="range" onSelect={onChange} />
        </DatepickerContainer>
      ) : null}
    </Container>
  );
};

const formatDateRange = (range: DateRange | undefined) => {
  if (range === undefined || range.from === undefined || range.to === undefined) {
    return 'Ingen periode valgt';
  }

  return (
    <>
      <Time date={range.from} /> - <Time date={range.to} />
    </>
  );
};

interface TimeProps {
  date: Date;
}

const Time = ({ date }: TimeProps) => <time dateTime={formatISO(date)}>{format(date, 'dd.MM.yyyy')}</time>;

const Container = styled.div`
  position: relative;
`;

const DatepickerContainer = styled.div`
  position: absolute;
  left: 0;
  top: 100%;
  z-index: 1;
  background-color: white;
  border-radius: var(--a-border-radius-medium);
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
`;

const StyledButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: var(--a-spacing-3);
  column-gap: var(--a-spacing-3);
`;

const StyledDateRange = styled(BodyShort)`
  width: 100%;
  padding-left: var(--a-spacing-3);
  padding-right: var(--a-spacing-3);
`;
