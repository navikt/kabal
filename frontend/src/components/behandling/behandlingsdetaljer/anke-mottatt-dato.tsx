import { parseISO } from 'date-fns';
import React from 'react';
import { ReadOnlyDate } from '@app/components/behandling/behandlingsdetaljer/read-only-date';
import { DateContainer } from '@app/components/behandling/styled-components';
import { CURRENT_YEAR_IN_CENTURY } from '@app/components/date-picker/constants';
import { DatePicker } from '@app/components/date-picker/date-picker';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useCanEdit } from '@app/hooks/use-can-edit';
import { useFieldName } from '@app/hooks/use-field-name';
import { useValidationError } from '@app/hooks/use-validation-error';
import { useSetMottattKlageinstansMutation } from '@app/redux-api/oppgaver/mutations/behandling-dates';
import { SaksTypeEnum } from '@app/types/kodeverk';

const ID = 'anke-mottatt-dato';

export const AnkeMottattDato = () => {
  const canEdit = useCanEdit();
  const { data } = useOppgave();
  const error = useValidationError('mottattKlageinstans');
  const label = useFieldName('mottattKlageinstans');
  const [setMottattKlageinstans] = useSetMottattKlageinstansMutation();

  if (data?.typeId !== SaksTypeEnum.ANKE) {
    return null;
  }

  const value = data?.mottattKlageinstans ?? null;

  if (!canEdit) {
    return <ReadOnlyDate date={value} id={ID} label={label} />;
  }

  return (
    <DateContainer>
      <DatePicker
        label={label}
        disabled={!canEdit}
        onChange={(mottattKlageinstans) => {
          if (mottattKlageinstans !== null && mottattKlageinstans !== value) {
            setMottattKlageinstans({ oppgaveId: data.id, mottattKlageinstans });
          }
        }}
        value={value === null ? undefined : parseISO(value)}
        error={error}
        id={ID}
        size="small"
        centuryThreshold={CURRENT_YEAR_IN_CENTURY}
      />
    </DateContainer>
  );
};
