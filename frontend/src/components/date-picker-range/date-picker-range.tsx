import { useOnClickOutside } from '@app/hooks/use-on-click-outside';
import { CalendarIcon } from '@navikt/aksel-icons';
import { Alert, Box, Button, type ButtonProps, DatePicker, HStack, Tooltip } from '@navikt/ds-react';
import { format, formatISO, parseISO } from 'date-fns';
import { useCallback, useRef, useState } from 'react';
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
  buttonClassName?: string;
  buttonSize?: ButtonProps['size'];
}

export const DatePickerRange = ({ onChange, selected, buttonLabel, gridArea, buttonClassName, buttonSize }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const onClick = useCallback(() => setIsOpen((o) => !o), []);
  const ref = useRef(null);

  useOnClickOutside(ref, () => setIsOpen(false));

  const from = typeof selected.from === 'undefined' ? undefined : parseISO(selected.from);
  const to = typeof selected.to === 'undefined' ? undefined : parseISO(selected.to);

  const active = from !== undefined || to !== undefined;

  const variant: ButtonProps['variant'] = active ? 'primary-neutral' : 'tertiary-neutral';

  return (
    <HStack className="relative" style={{ gridArea }} ref={ref}>
      <Tooltip content="Filtrer på dato">
        <Button
          onClick={onClick}
          size={buttonSize}
          variant={variant}
          icon={<CalendarIcon aria-hidden />}
          className={buttonClassName}
        >
          {buttonLabel}
        </Button>
      </Tooltip>
      {isOpen ? (
        <Box
          background="default"
          shadow="dialog"
          borderRadius="4"
          position="absolute"
          right="space-0"
          className="top-full z-1 font-normal"
        >
          <HStack justify="end" padding="space-12" gap="space-12">
            <Button size="small" variant="primary" onClick={() => setIsOpen(false)}>
              Lukk
            </Button>
            <Button
              data-color="neutral"
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
        </Box>
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
