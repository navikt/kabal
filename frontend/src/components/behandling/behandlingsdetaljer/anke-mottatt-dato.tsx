import React from 'react';
import styled from 'styled-components';
import { useOppgave } from '../../../hooks/oppgavebehandling/use-oppgave';
import { useCanEdit } from '../../../hooks/use-can-edit';
import { useValidationError } from '../../../hooks/use-validation-error';
import { useSetMottattKlageinstansMutation } from '../../../redux-api/oppgaver/mutations/behandling-dates';
import { SaksTypeEnum } from '../../../types/kodeverk';
import { CURRENT_YEAR_IN_CENTURY } from '../../date-picker/constants';
import { DatePicker } from '../../date-picker/date-picker';

export const AnkeMottattDato = () => {
  const canEdit = useCanEdit();
  const { data } = useOppgave();
  const error = useValidationError('mottattKlageinstans');
  const [setMottattKlageinstans] = useSetMottattKlageinstansMutation();

  if (data?.type !== SaksTypeEnum.ANKE) {
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
        value={value}
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
