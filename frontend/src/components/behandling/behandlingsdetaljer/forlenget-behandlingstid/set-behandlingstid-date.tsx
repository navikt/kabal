import { MAX_MONTHS_FROM_TODAY } from '@app/components/behandling/behandlingsdetaljer/forlenget-behandlingstid/constants';
import { validateDate } from '@app/components/behandling/behandlingsdetaljer/forlenget-behandlingstid/validate';
import { CURRENT_YEAR_IN_CENTURY } from '@app/components/date-picker/constants';
import { DatePicker } from '@app/components/date-picker/date-picker';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useSetBehandlingstidDateMutation } from '@app/redux-api/forlenget-behandlingstid';
import { ErrorMessage, VStack } from '@navikt/ds-react';
import { addDays, addMonths } from 'date-fns';

interface Props {
  value: string | null;
  id: string;
  error: string | undefined;
  setError: (error: string | undefined) => void;
  varselTypeIsOriginal: boolean;
}

export const SetBehandlingstidDate = ({ value, id, error, setError, varselTypeIsOriginal }: Props) => {
  const [setDate] = useSetBehandlingstidDateMutation({ fixedCacheKey: id });
  const { data } = useOppgave();

  if (varselTypeIsOriginal || data === undefined) {
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

          const error = validateDate(date, data.varsletFrist);
          setError(error);
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
