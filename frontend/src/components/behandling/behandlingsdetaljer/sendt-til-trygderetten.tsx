import { parseISO } from 'date-fns';
import React from 'react';
import styled from 'styled-components';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useCanEdit } from '@app/hooks/use-can-edit';
import { useValidationError } from '@app/hooks/use-validation-error';
import { useSetSendtTilTrygderettenMutation } from '@app/redux-api/oppgaver/mutations/behandling-dates';
import { SaksTypeEnum } from '@app/types/kodeverk';
import { CURRENT_YEAR_IN_CENTURY } from '../../date-picker/constants';
import { DatePicker } from '../../date-picker/date-picker';

export const SendtTilTrygderetten = () => {
  const canEdit = useCanEdit();
  const { data } = useOppgave();
  const error = useValidationError('sendtTilTrygderetten');
  const [setSendtTilTrygderetten] = useSetSendtTilTrygderettenMutation();

  if (data?.typeId !== SaksTypeEnum.ANKE_I_TRYGDERETTEN) {
    return null;
  }

  const value = data.sendtTilTrygderetten?.split('T')[0] ?? null;

  return (
    <StyledSendtTilTrygderetten>
      <DatePicker
        label="Sendt til Trygderetten"
        disabled={!canEdit}
        onChange={(sendtTilTrygderetten) => {
          if (sendtTilTrygderetten !== null && sendtTilTrygderetten !== value) {
            setSendtTilTrygderetten({ oppgaveId: data.id, sendtTilTrygderetten, typeId: data.typeId });
          }
        }}
        value={value === null ? undefined : parseISO(value)}
        error={error}
        id="sendt-til-trygderetten"
        size="small"
        centuryThreshold={CURRENT_YEAR_IN_CENTURY}
      />
    </StyledSendtTilTrygderetten>
  );
};

const StyledSendtTilTrygderetten = styled.section`
  margin-bottom: 32px;
`;
