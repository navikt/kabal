import React from 'react';
import styled from 'styled-components';
import { useOppgave } from '../../../hooks/oppgavebehandling/use-oppgave';
import { useCanEdit } from '../../../hooks/use-can-edit';
import { useValidationError } from '../../../hooks/use-validation-error';
import { useSetMottattVedtaksinstansMutation } from '../../../redux-api/oppgaver/mutations/behandling';
import { OppgaveType } from '../../../types/kodeverk';
import { DatepickerWithError } from '../../date-picker-with-error/date-picker-with-error';

export const MottattVedtaksinstans = () => {
  const canEdit = useCanEdit();
  const { data } = useOppgave();
  const error = useValidationError('mottattVedtaksinstans');
  const [setMottattVedtaksinstans] = useSetMottattVedtaksinstansMutation();

  if (data?.type === OppgaveType.ANKE_I_TRYGDERETTEN) {
    return null;
  }

  return (
    <StyledMottattVedtaksinstans>
      <DatepickerWithError
        label="Mottatt vedtaksinstans:"
        disabled={!canEdit}
        onChange={(mottattVedtaksinstans) => {
          if (mottattVedtaksinstans !== null && data?.type === OppgaveType.KLAGE) {
            setMottattVedtaksinstans({ oppgaveId: data.id, mottattVedtaksinstans, type: data.type });
          }
        }}
        limitations={{
          maxDate: new Date().toISOString(),
        }}
        value={data?.mottattVedtaksinstans ?? undefined}
        locale="nb"
        showYearSelector
        error={error}
        data-testid="mottatt-vedtaksinstans"
      />
    </StyledMottattVedtaksinstans>
  );
};

const StyledMottattVedtaksinstans = styled.div`
  margin-bottom: 32px;
`;
