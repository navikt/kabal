import { MAX_MONTHS_FROM_TODAY } from '@app/components/behandling/behandlingsdetaljer/forlenget-behandlingstid/constants';
import { CURRENT_YEAR_IN_CENTURY } from '@app/components/date-picker/constants';
import { DatePicker } from '@app/components/date-picker/date-picker';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useSetBehandlingstidDateMutation } from '@app/redux-api/forlenget-behandlingstid';
import { ErrorMessage, VStack } from '@navikt/ds-react';
import { addDays, addMonths, isAfter } from 'date-fns';

interface Props {
  value: string | null;
  id: string;
  error: string | undefined;
  setError: (error: string | undefined) => void;
}

export const SetBehandlingstidDate = ({ value, id, error, setError }: Props) => {
  const [setDate] = useSetBehandlingstidDateMutation({ fixedCacheKey: id });
  const { data } = useOppgave();

  if (data === undefined) {
    return null;
  }

  return (
    <VStack gap="2">
      <DatePicker
        label="Ny frist"
        onChange={(date) => {
          setDate({ id, behandlingstidDate: date });

          if (date === null) {
            return setError(undefined);
          }

          if (data.varsletFrist !== null && !isAfter(new Date(date), new Date(data.varsletFrist))) {
            return setError('Fristen kan ikke være før forrige varslet frist');
          }

          if (isAfter(new Date(date), addMonths(new Date(), MAX_MONTHS_FROM_TODAY))) {
            return setError('Fristen kan ikke være mer enn fire måneder frem i tid');
          }

          setError(undefined);
        }}
        value={value}
        size="small"
        centuryThreshold={CURRENT_YEAR_IN_CENTURY}
        fromDate={data.varsletFrist === null ? new Date() : addDays(new Date(data.varsletFrist), 1)}
        toDate={addMonths(new Date(), MAX_MONTHS_FROM_TODAY)}
        width={125}
      />
      {error === undefined ? null : <ErrorMessage size="small">{error}</ErrorMessage>}
    </VStack>
  );
};
