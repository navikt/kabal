import React from 'react';
import { useOppgave } from '../../../hooks/oppgavebehandling/use-oppgave';
import { useCanEdit } from '../../../hooks/use-can-edit';
import { useValidationError } from '../../../hooks/use-validation-error';
import { useSetMottattKlageinstansMutation } from '../../../redux-api/behandlinger';
import { OppgaveType } from '../../../types/kodeverk';
import { DatepickerWithError } from '../../date-picker-with-error/date-picker-with-error';

export const AnkeMottattDato = () => {
  const canEdit = useCanEdit();
  const { data } = useOppgave();
  const error = useValidationError('mottattKlageinstans');
  const [setMottattKlageinstans] = useSetMottattKlageinstansMutation();

  return (
    <DatepickerWithError
      label="Anke mottatt dato:"
      disabled={!canEdit}
      onChange={(mottattKlageinstans) => {
        if (mottattKlageinstans !== null && data?.type === OppgaveType.ANKE) {
          setMottattKlageinstans({ oppgaveId: data.id, mottattKlageinstans, type: data.type });
        }
      }}
      limitations={{
        maxDate: new Date().toISOString(),
      }}
      value={data?.mottattKlageinstans ?? undefined}
      locale="nb"
      showYearSelector
      error={error}
      data-testid="anke-mottatt-dato"
    />
  );
};