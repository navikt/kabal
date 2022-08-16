import React from 'react';
import styled from 'styled-components';
import { useOppgave } from '../../../hooks/oppgavebehandling/use-oppgave';
import { useCanEdit } from '../../../hooks/use-can-edit';
import { useValidationError } from '../../../hooks/use-validation-error';
import { useSetKjennelseMottattMutation } from '../../../redux-api/oppgaver/mutations/behandling';
import { OppgaveType } from '../../../types/kodeverk';
import { DatepickerWithError } from '../../date-picker-with-error/date-picker-with-error';

export const KjennelseMottatt = () => {
  const canEdit = useCanEdit();
  const { data } = useOppgave();
  const error = useValidationError('kjennelseMottatt');
  const [setKjennelseMottatt] = useSetKjennelseMottattMutation();

  if (data?.type !== OppgaveType.ANKE_I_TRYGDERETTEN) {
    return null;
  }

  return (
    <StyledKjennelseMottatt>
      <DatepickerWithError
        label="Kjennelse mottatt:"
        disabled={!canEdit}
        onChange={(kjennelseMottatt) => {
          if (data?.type === OppgaveType.ANKE_I_TRYGDERETTEN) {
            setKjennelseMottatt({ oppgaveId: data.id, kjennelseMottatt, type: data.type });
          }
        }}
        limitations={{
          maxDate: new Date().toISOString(),
        }}
        value={data.kjennelseMottatt?.split('T')[0] ?? undefined}
        locale="nb"
        showYearSelector
        error={error}
        data-testid="kjennelse-mottatt"
        inputName="kjennelse-mottatt"
        size="small"
      />
    </StyledKjennelseMottatt>
  );
};

const StyledKjennelseMottatt = styled.section`
  margin-bottom: 32px;
`;
