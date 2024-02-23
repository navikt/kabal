import { HourglassIcon, XMarkIcon } from '@navikt/aksel-icons';
import { Button, ErrorSummary, Panel, Textarea } from '@navikt/ds-react';
import { addDays, addWeeks, differenceInWeeks, format, isPast, isValid, parseISO } from 'date-fns';
import React, { useMemo, useState } from 'react';
import { styled } from 'styled-components';
import { ISO_FORMAT, PRETTY_FORMAT } from '@app/components/date-picker/constants';
import { DatePicker } from '@app/components/date-picker/date-picker';
import { useSattPaaVentMutation } from '@app/redux-api/oppgaver/mutations/vent';

interface Props {
  oppgaveId: string;
  close: () => void;
}

const MAX_LENGTH = 100;

export const SettPaaVentPanel = ({ oppgaveId, close }: Props) => {
  const [to, setTo] = useState<string | null>(null);
  const [reason, setReason] = useState<string>('');
  const [settPaaVent, { isLoading }] = useSattPaaVentMutation();
  const [dateError, setDateError] = useState<string | null>(null);
  const [reasonError, setReasonError] = useState<string | null>(null);

  const today = new Date();
  const fromDate = addDays(today, 1);

  const dates: [[number, Date], [number, Date], [number, Date], [number, Date], [number, Date]] = useMemo(() => {
    const now = new Date();

    return [
      [1, addWeeks(now, 1)],
      [2, addWeeks(now, 2)],
      [3, addWeeks(now, 3)],
      [4, addWeeks(now, 4)],
      [5, addWeeks(now, 5)],
    ];
  }, []);

  return (
    <StyledPanel>
      <DatePicker
        label="Frist"
        value={to}
        fromDate={fromDate}
        toDate={dates.at(-1)?.[1]}
        onChange={setTo}
        id="paa-vent-date"
        size="small"
      />
      <Column>
        {dates.map(([weeks, date]) => {
          const formattedDate = format(date, ISO_FORMAT);
          const isActive = to === formattedDate;

          return (
            <Button
              type="button"
              variant={isActive ? 'primary' : 'secondary'}
              size="small"
              onClick={() => setTo(formattedDate)}
              key={date.toISOString()}
              disabled={isLoading}
              aria-pressed={isActive}
            >
              {weeks} {weeks !== 1 ? 'uker' : 'uke'}
              <br />({format(date, PRETTY_FORMAT)})
            </Button>
          );
        })}
      </Column>
      <Textarea
        label="Grunn (stikkord)"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        maxLength={MAX_LENGTH}
        size="small"
        id="paa-vent-reason"
        placeholder="Skriv kort hvorfor saken skal settes på vent. F.eks. «Venter på tilsvar»."
      />
      <Errors dateError={dateError} reasonError={reasonError} />
      <Row>
        <Button
          type="button"
          variant="primary"
          size="small"
          onClick={() => {
            const newDateError = validateDate(to);
            const newReasonError = validateReason(reason);

            setDateError(newDateError);
            setReasonError(newReasonError);

            if (newDateError === null && newReasonError === null && to !== null) {
              settPaaVent({ to, oppgaveId, reason });
            }
          }}
          loading={isLoading}
          icon={<HourglassIcon aria-hidden />}
        >
          Sett på vent
        </Button>
        <Button type="button" variant="secondary" size="small" onClick={close} icon={<XMarkIcon aria-hidden />}>
          Avbryt
        </Button>
      </Row>
    </StyledPanel>
  );
};

interface ErrorsProps {
  dateError: string | null;
  reasonError: string | null;
}

const Errors = ({ dateError, reasonError }: ErrorsProps) => {
  if (dateError === null && reasonError === null) {
    return null;
  }

  const errors = [
    { message: dateError, href: '#paa-vent-date' },
    { message: reasonError, href: '#paa-vent-reason' },
  ].filter(({ message }) => message !== null);

  return (
    <ErrorSummary heading="Du må rette opp følgende før du kan sette behandlingen på vent" size="small">
      {errors.map(({ message, href }) => (
        <ErrorSummary.Item href={href} key={href}>
          {message}
        </ErrorSummary.Item>
      ))}
    </ErrorSummary>
  );
};

const validateDate = (date: string | null): string | null => {
  if (date === null) {
    return 'Velg en frist.';
  }

  const parsedDate = parseISO(date);

  if (!isValid(parsedDate)) {
    return 'Bruk et gyldig datoformat.';
  }

  if (isPast(parsedDate)) {
    return 'Sett en frist frem i tid.';
  }

  if (differenceInWeeks(parsedDate, new Date()) > 5) {
    return 'Sett en frist innen 5 uker.';
  }

  return null;
};

const validateReason = (reason: string): string | null => {
  if (reason.length === 0) {
    return 'Skriv en grunn.';
  }

  if (reason.length > MAX_LENGTH) {
    return 'Skriv en grunn på maks 100 tegn.';
  }

  return null;
};

const StyledPanel = styled(Panel)`
  position: absolute;
  display: flex;
  flex-direction: column;
  row-gap: 16px;
  z-index: 1;
  bottom: 100%;
  left: 0;
  padding: 16px;
  border-radius: var(--a-border-radius-medium);
  box-shadow: rgba(0, 0, 0, 0.25) 0px 0px 4px;
  width: 400px;
`;

const Row = styled.div`
  display: flex;
  column-gap: 16px;
  align-items: center;
  flex-direction: row;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
