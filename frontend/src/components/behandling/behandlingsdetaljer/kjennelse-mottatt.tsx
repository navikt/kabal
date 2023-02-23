import React from 'react';
import styled from 'styled-components';
import { useOppgave } from '../../../hooks/oppgavebehandling/use-oppgave';
import { useCanEdit } from '../../../hooks/use-can-edit';
import { useValidationError } from '../../../hooks/use-validation-error';
import { useSetKjennelseMottattMutation } from '../../../redux-api/oppgaver/mutations/behandling-dates';
import { SaksTypeEnum } from '../../../types/kodeverk';
import { CURRENT_YEAR_IN_CENTURY } from '../../date-picker/constants';
import { DatePicker } from '../../date-picker/date-picker';

export const KjennelseMottatt = () => {
  const canEdit = useCanEdit();
  const { data } = useOppgave();
  const error = useValidationError('kjennelseMottatt');
  const [setKjennelseMottatt] = useSetKjennelseMottattMutation();

  if (data?.type !== SaksTypeEnum.ANKE_I_TRYGDERETTEN) {
    return null;
  }

  const value = data.kjennelseMottatt?.split('T')[0] ?? null;

  return (
    <StyledKjennelseMottatt>
      <DatePicker
        label="Kjennelse mottatt:"
        disabled={!canEdit}
        onChange={(kjennelseMottatt) => {
          if (kjennelseMottatt !== value) {
            setKjennelseMottatt({ oppgaveId: data.id, kjennelseMottatt, type: data.type });
          }
        }}
        value={value}
        error={error}
        id="kjennelse-mottatt"
        size="small"
        centuryThreshold={CURRENT_YEAR_IN_CENTURY}
      />
    </StyledKjennelseMottatt>
  );
};

const StyledKjennelseMottatt = styled.section`
  margin-bottom: 32px;
`;
