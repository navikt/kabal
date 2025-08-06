import { useOnClickOutside } from '@app/hooks/use-on-click-outside';
import { CalendarIcon } from '@navikt/aksel-icons';
import { Alert, BoxNew, Button, type ButtonProps, DatePicker, HStack } from '@navikt/ds-react';
import { format, formatISO, parseISO } from 'date-fns';
import { useCallback, useMemo, useRef, useState } from 'react';
import type { DateRange } from 'react-day-picker';

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
  buttonClassName?: string;
}

export const DatePickerRange = ({
  onChange,
  selected,
  buttonLabel,
  gridArea,
  neutral = false,
  buttonClassName,
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
    <HStack className="relative" style={{ gridArea }} ref={ref}>
      <Button
        onClick={onClick}
        size="small"
        variant={variant}
        icon={<CalendarIcon aria-hidden />}
        className={buttonClassName}
      >
        {buttonLabel}
      </Button>
      {isOpen ? (
        <BoxNew
          background="default"
          shadow="dialog"
          borderRadius="medium"
          position="absolute"
          right="0"
          className="top-full z-1 font-normal"
        >
          <HStack justify="end" padding="3" gap="3">
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
          </HStack>
          <div className="h-8 w-full px-3">{formatDateRange(from, to)}</div>
          <DatePicker.Standalone selected={{ from, to }} mode="range" onSelect={onChange} />
        </BoxNew>
      ) : null}
    </HStack>
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
