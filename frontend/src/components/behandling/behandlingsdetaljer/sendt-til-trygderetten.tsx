import React from 'react';
import styled from 'styled-components';
import { useOppgave } from '../../../hooks/oppgavebehandling/use-oppgave';
import { useCanEdit } from '../../../hooks/use-can-edit';
import { useValidationError } from '../../../hooks/use-validation-error';
import { useSetSendtTilTrygderettenMutation } from '../../../redux-api/oppgaver/mutations/behandling';
import { OppgaveType } from '../../../types/kodeverk';
import { DatepickerWithError } from '../../date-picker-with-error/date-picker-with-error';

export const SendtTilTrygderetten = () => {
  const canEdit = useCanEdit();
  const { data } = useOppgave();
  const error = useValidationError('sendtTilTrygderetten');
  const [setSendtTilTrygderetten] = useSetSendtTilTrygderettenMutation();

  if (data?.type !== OppgaveType.ANKE_I_TRYGDERETTEN) {
    return null;
  }

  return (
    <StyledSendtTilTrygderetten>
      <DatepickerWithError
        label="Sendt til Trygderetten:"
        disabled={!canEdit}
        onChange={(sendtTilTrygderetten) => {
          if (sendtTilTrygderetten !== null) {
            setSendtTilTrygderetten({ oppgaveId: data.id, sendtTilTrygderetten, type: data.type });
          }
        }}
        limitations={{
          maxDate: new Date().toISOString(),
        }}
        value={data.sendtTilTrygderetten?.split('T')[0] ?? undefined}
        locale="nb"
        showYearSelector
        error={error}
        data-testid="sendt-til-trygderetten"
        inputName="sendt-til-trygderetten"
      />
    </StyledSendtTilTrygderetten>
  );
};

const StyledSendtTilTrygderetten = styled.section`
  margin-bottom: 32px;
`;
