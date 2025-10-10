import { ISO_FORMAT, PRETTY_FORMAT } from '@app/components/date-picker/constants';
import { DatePicker } from '@app/components/date-picker/date-picker';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useSattPaaVentMutation } from '@app/redux-api/oppgaver/mutations/vent';
import { useSakstyperToPåVentReasons } from '@app/simple-api-state/use-kodeverk';
import { PaaVentReasonEnum } from '@app/types/kodeverk';
import { HourglassIcon, XMarkIcon } from '@navikt/aksel-icons';
import { BoxNew, Button, ErrorSummary, HStack, Radio, RadioGroup, Textarea, VStack } from '@navikt/ds-react';
import {
  addDays,
  addMonths,
  addWeeks,
  differenceInMonths,
  differenceInWeeks,
  format,
  isPast,
  isValid,
  parseISO,
} from 'date-fns';
import { useMemo, useState } from 'react';

interface Props {
  oppgaveId: string;
  close: () => void;
}

const MAX_LENGTH = 100;
const PÅ_VENT_REASON_ID = 'paa-vent-reason';
const PÅ_VENT_DATE_ID = 'paa-vent-date';

const NOW = new Date();
const DEFAULT_DATES: [number, Date][] = [
  [1, addWeeks(NOW, 1)],
  [2, addWeeks(NOW, 2)],
  [3, addWeeks(NOW, 3)],
  [4, addWeeks(NOW, 4)],
  [5, addWeeks(NOW, 5)],
];

const BERO_DATES: [number, Date][] = [
  [1, addMonths(NOW, 1)],
  [2, addMonths(NOW, 2)],
  [3, addMonths(NOW, 3)],
  [4, addMonths(NOW, 4)],
];

export const SettPaaVentPanel = ({ oppgaveId, close }: Props) => {
  const [to, setTo] = useState<string | null>(null);
  const [reason, setReason] = useState<string>('');
  const [settPaaVent, { isLoading }] = useSattPaaVentMutation();
  const [dateError, setDateError] = useState<string | null>(null);
  const [reasonError, setReasonError] = useState<string | null>(null);
  const { data: oppgave } = useOppgave();
  const { data: sakstypeToPåVentReasons = [] } = useSakstyperToPåVentReasons();
  const [reasonId, setReasonId] = useState<PaaVentReasonEnum | null>(null);

  const options = useMemo(() => {
    if (oppgave === undefined) {
      return [];
    }

    const sakstype = sakstypeToPåVentReasons.find(({ id }) => id === oppgave.typeId);

    if (sakstype === undefined) {
      return [];
    }

    return sakstype.sattPaaVentReasons.map((reason) => (
      <Radio key={reason.id} value={reason.id}>
        {reason.beskrivelse}
      </Radio>
    ));
  }, [oppgave, sakstypeToPåVentReasons]);

  const fromDate = addDays(NOW, 1);

  const dates = reasonId === PaaVentReasonEnum.SATT_I_BERO ? BERO_DATES : DEFAULT_DATES;

  return (
    <VStack asChild gap="7" left="0" position="absolute" className="bottom-full z-1">
      <BoxNew padding="6" background="raised" borderRadius="medium" shadow="dialog" width="400px">
        <RadioGroup onChange={setReasonId} value={reasonId} legend="Grunn" size="small">
          {options}
        </RadioGroup>

        {reasonId === PaaVentReasonEnum.ANNET ? (
          <Textarea
            label="Forklaring"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            maxLength={MAX_LENGTH}
            size="small"
            id={PÅ_VENT_REASON_ID}
            placeholder="Skriv kort hvorfor saken skal settes på vent"
          />
        ) : null}

        <DatePicker
          label="Frist"
          value={to}
          fromDate={fromDate}
          toDate={dates.at(-1)?.[1]}
          onChange={setTo}
          onErrorChange={setTo}
          id={PÅ_VENT_DATE_ID}
          size="small"
        />
        <VStack gap="3">
          {dates.map(([units, date]) => {
            const formattedDate = format(date, ISO_FORMAT);
            const isActive = to === formattedDate;
            const label =
              reasonId === PaaVentReasonEnum.SATT_I_BERO
                ? units === 1
                  ? 'måned'
                  : 'måneder'
                : units === 1
                  ? 'uke'
                  : 'uker';

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
                {units} {label}
                <br />({format(date, PRETTY_FORMAT)})
              </Button>
            );
          })}
        </VStack>

        <Errors dateError={dateError} reasonError={reasonError} />

        <HStack align="center" justify="space-between">
          <Button
            type="button"
            variant="primary"
            size="small"
            onClick={() => {
              const newDateError = validateDate(reasonId, to);
              const newReasonError = validateReason(reasonId, reason);

              setDateError(newDateError);
              setReasonError(newReasonError);

              if (newDateError === null && newReasonError === null && to !== null && reasonId !== null) {
                const sattPaaVent =
                  reasonId === PaaVentReasonEnum.ANNET ? { to, reason, reasonId } : { to, reason: null, reasonId };

                settPaaVent({ oppgaveId, sattPaaVent });
              }
            }}
            loading={isLoading}
            icon={<HourglassIcon aria-hidden />}
          >
            Sett på vent
          </Button>
          <Button
            type="button"
            variant="secondary-neutral"
            size="small"
            onClick={close}
            icon={<XMarkIcon aria-hidden />}
          >
            Avbryt
          </Button>
        </HStack>
      </BoxNew>
    </VStack>
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
    { message: dateError, href: `#${PÅ_VENT_DATE_ID}` },
    { message: reasonError, href: `#${PÅ_VENT_REASON_ID}` },
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

const validateDate = (reasonId: PaaVentReasonEnum | null, date: string | null): string | null => {
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

  if (reasonId === PaaVentReasonEnum.SATT_I_BERO) {
    return differenceInMonths(parsedDate, NOW) >= 4 ? 'Sett en frist innen fire måneder.' : null;
  }

  if (differenceInWeeks(parsedDate, NOW) >= 5) {
    return 'Sett en frist innen fem uker.';
  }

  return null;
};

const validateReason = (reasonId: PaaVentReasonEnum | null, reason: string): string | null => {
  if (reasonId === null) {
    return 'Velg en grunn.';
  }

  if (reasonId === PaaVentReasonEnum.ANNET && reason.length === 0) {
    return 'Skriv en forklaring.';
  }

  if (reason.length > MAX_LENGTH) {
    return `Skriv en forklaring på maks ${MAX_LENGTH} tegn.`;
  }

  return null;
};
