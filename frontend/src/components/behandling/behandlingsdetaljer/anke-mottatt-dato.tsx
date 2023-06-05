import { parseISO } from 'date-fns';
import React from 'react';
import styled from 'styled-components';
import { CURRENT_YEAR_IN_CENTURY } from '@app/components/date-picker/constants';
import { DatePicker } from '@app/components/date-picker/date-picker';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useCanEdit } from '@app/hooks/use-can-edit';
import { useValidationError } from '@app/hooks/use-validation-error';
import { useSetMottattKlageinstansMutation } from '@app/redux-api/oppgaver/mutations/behandling-dates';
import { SaksTypeEnum } from '@app/types/kodeverk';

export const AnkeMottattDato = () => {
  const canEdit = useCanEdit();
  const { data } = useOppgave();
  const error = useValidationError('mottattKlageinstans');
  const [setMottattKlageinstans] = useSetMottattKlageinstansMutation();

  if (data?.typeId !== SaksTypeEnum.ANKE) {
    return null;
  }

  const value = data?.mottattKlageinstans ?? null;

  return (
    <StyledAnkeMottattDato>
      <DatePicker
        label="Anke mottatt dato:"
        disabled={!canEdit}
        onChange={(mottattKlageinstans) => {
          if (mottattKlageinstans !== null && mottattKlageinstans !== value) {
            setMottattKlageinstans({ oppgaveId: data.id, mottattKlageinstans });
          }
        }}
        value={value === null ? undefined : parseISO(value)}
        error={error}
        id="anke-mottatt-dato"
        size="small"
        centuryThreshold={CURRENT_YEAR_IN_CENTURY}
      />
    </StyledAnkeMottattDato>
  );
};

const StyledAnkeMottattDato = styled.section`
  margin-bottom: 32px;
`;
