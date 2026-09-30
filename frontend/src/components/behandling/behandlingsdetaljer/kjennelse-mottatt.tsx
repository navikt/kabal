import { addDays, subDays } from 'date-fns';
import { useState } from 'react';
import { ReadOnlyDate } from '@/components/behandling/behandlingsdetaljer/read-only-date';
import { DateContainer } from '@/components/behandling/styled-components';
import { CURRENT_YEAR_IN_CENTURY } from '@/components/date-picker/constants';
import { DatePicker } from '@/components/date-picker/date-picker';
import { isTrygderettenBehandling } from '@/functions/is-trygderetten-sak';
import { useOppgave } from '@/hooks/oppgavebehandling/use-oppgave';
import { useCanEditBehandling } from '@/hooks/use-can-edit';
import { useFieldName } from '@/hooks/use-field-name';
import { useValidationError } from '@/hooks/use-validation-error';
import { useSetKjennelseMottattMutation } from '@/redux-api/oppgaver/mutations/behandling-dates';

const ID = 'kjennelse-mottatt';

export const KjennelseMottatt = () => {
  const canEdit = useCanEditBehandling();
  const { data } = useOppgave();
  const error = useValidationError('kjennelseMottatt');
  const [localError, setLocalError] = useState<string | null>(null);
  const label = useFieldName('kjennelseMottatt');
  const [setKjennelseMottatt] = useSetKjennelseMottattMutation();

  if (data === undefined || !isTrygderettenBehandling(data)) {
    return null;
  }

  const { kjennelseMottatt, sendtTilTrygderetten, typeId, id } = data;

  const value = kjennelseMottatt?.split('T')[0] ?? null;

  if (!canEdit) {
    return <ReadOnlyDate date={value} id={ID} label={label} />;
  }

  const fromDate = sendtTilTrygderetten?.split('T')[0] ?? null;

  const onChange = (kjennelseMottatt: string | null) => {
    setLocalError(null);

    if (kjennelseMottatt === value) {
      return;
    }

    if (kjennelseMottatt === null) {
      return setKjennelseMottatt({ oppgaveId: id, kjennelseMottatt, typeId });
    }

    if (fromDate !== null && fromDate >= kjennelseMottatt) {
      setLocalError('Kjennelse mottatt må være etter Sendt til Trygderetten.');
    }

    setKjennelseMottatt({ oppgaveId: id, kjennelseMottatt, typeId });
  };

  return (
    <DateContainer>
      <DatePicker
        label={label}
        disabled={!canEdit}
        onChange={onChange}
        value={value}
        error={localError || error}
        id={ID}
        size="small"
        centuryThreshold={CURRENT_YEAR_IN_CENTURY}
        warningThreshhold={subDays(new Date(), 360)}
        fromDate={fromDate === null ? undefined : addDays(fromDate, 1)}
      />
    </DateContainer>
  );
};
