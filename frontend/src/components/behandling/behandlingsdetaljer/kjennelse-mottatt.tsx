import { parseISO } from 'date-fns';
import React from 'react';
import { styled } from 'styled-components';
import { CURRENT_YEAR_IN_CENTURY } from '@app/components/date-picker/constants';
import { DatePicker } from '@app/components/date-picker/date-picker';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useCanEdit } from '@app/hooks/use-can-edit';
import { useFieldName } from '@app/hooks/use-field-name';
import { useValidationError } from '@app/hooks/use-validation-error';
import { useSetKjennelseMottattMutation } from '@app/redux-api/oppgaver/mutations/behandling-dates';
import { SaksTypeEnum } from '@app/types/kodeverk';

export const KjennelseMottatt = () => {
  const canEdit = useCanEdit();
  const { data } = useOppgave();
  const error = useValidationError('kjennelseMottatt');
  const label = useFieldName('kjennelseMottatt');
  const [setKjennelseMottatt] = useSetKjennelseMottattMutation();

  if (data?.typeId !== SaksTypeEnum.ANKE_I_TRYGDERETTEN) {
    return null;
  }

  const value = data.kjennelseMottatt?.split('T')[0] ?? null;

  const onChange = (kjennelseMottatt: string | null) => {
    if (kjennelseMottatt !== value) {
      setKjennelseMottatt({ oppgaveId: data.id, kjennelseMottatt, typeId: data.typeId });
    }
  };

  return (
    <StyledKjennelseMottatt>
      <DatePicker
        label={label}
        disabled={!canEdit}
        onChange={onChange}
        value={value === null ? undefined : parseISO(value)}
        error={error}
        id="kjennelse-mottatt"
        size="small"
        centuryThreshold={CURRENT_YEAR_IN_CENTURY}
      />
    </StyledKjennelseMottatt>
  );
};

const StyledKjennelseMottatt = styled.section`
  display: flex;
  flex-direction: row;
  column-gap: 0;
  margin-bottom: 32px;
  align-items: flex-end;
`;
