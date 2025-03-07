import { setErrorMessage } from '@app/components/behandling/behandlingsdetaljer/forlenget-behandlingstid/use-debounce';
import { CURRENT_YEAR_IN_CENTURY } from '@app/components/date-picker/constants';
import { DatePicker } from '@app/components/date-picker/date-picker';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useSetBehandlingstidDateMutation } from '@app/redux-api/forlenget-behandlingstid';
import { ErrorMessage, VStack } from '@navikt/ds-react';
import { addDays, addYears } from 'date-fns';
import { useState } from 'react';

interface Props {
  value: string | null;
  id: string;
}

export const SetBehandlingstidDate = ({ value, id }: Props) => {
  const [setDate] = useSetBehandlingstidDateMutation({ fixedCacheKey: id });
  const { data } = useOppgave();
  const [error, setError] = useState<string>();

  if (data === undefined) {
    return null;
  }

  return (
    <VStack gap="2">
      <DatePicker
        label="Ny frist"
        onChange={async (date) => {
          try {
            await setDate({ id, behandlingstidDate: date }).unwrap();
          } catch (e) {
            setErrorMessage(e, setError);
          }
        }}
        value={value}
        size="small"
        centuryThreshold={CURRENT_YEAR_IN_CENTURY}
        fromDate={data.varsletFrist === null ? new Date() : addDays(new Date(data.varsletFrist), 1)}
        toDate={addYears(new Date(), 1)}
        width={125}
      />
      {error === undefined ? null : <ErrorMessage size="small">{error}</ErrorMessage>}
    </VStack>
  );
};
