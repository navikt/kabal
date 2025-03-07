import { CURRENT_YEAR_IN_CENTURY } from '@app/components/date-picker/constants';
import { DatePicker } from '@app/components/date-picker/date-picker';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useSetBehandlingstidDateMutation } from '@app/redux-api/forlenget-behandlingstid';
import { addDays, addYears } from 'date-fns';

interface Props {
  value: string | null;
  id: string;
}

export const SetBehandlingstidDate = ({ value, id }: Props) => {
  const [setDate] = useSetBehandlingstidDateMutation({ fixedCacheKey: id });
  const { data } = useOppgave();

  if (data === undefined) {
    return null;
  }

  return (
    <DatePicker
      label="Ny frist"
      onChange={(date) => setDate({ id, behandlingstidDate: date })}
      value={value}
      size="small"
      centuryThreshold={CURRENT_YEAR_IN_CENTURY}
      fromDate={data.varsletFrist === null ? new Date() : addDays(new Date(data.varsletFrist), 1)}
      toDate={addYears(new Date(), 1)}
      width={125}
    />
  );
};
