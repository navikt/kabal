import { parseISO } from 'date-fns';
import React from 'react';
import { styled } from 'styled-components';
import { CURRENT_YEAR_IN_CENTURY } from '@app/components/date-picker/constants';
import { DatePicker } from '@app/components/date-picker/date-picker';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useCanEdit } from '@app/hooks/use-can-edit';
import { useValidationError } from '@app/hooks/use-validation-error';
import { useSetMottattVedtaksinstansMutation } from '@app/redux-api/oppgaver/mutations/behandling-dates';
import { SaksTypeEnum } from '@app/types/kodeverk';

export const MottattVedtaksinstans = () => {
  const canEdit = useCanEdit();
  const { data } = useOppgave();
  const error = useValidationError('mottattVedtaksinstans');
  const [setMottattVedtaksinstans] = useSetMottattVedtaksinstansMutation();

  if (data?.typeId !== SaksTypeEnum.KLAGE) {
    return null;
  }

  const value = data?.mottattVedtaksinstans ?? null;

  return (
    <StyledMottattVedtaksinstans>
      <DatePicker
        label="Mottatt vedtaksinstans:"
        disabled={!canEdit}
        onChange={(mottattVedtaksinstans) => {
          if (mottattVedtaksinstans !== null && mottattVedtaksinstans !== value) {
            setMottattVedtaksinstans({ oppgaveId: data.id, mottattVedtaksinstans, typeId: data.typeId });
          }
        }}
        value={value === null ? undefined : parseISO(value)}
        error={error}
        id="mottatt-vedtaksinstans"
        size="small"
        centuryThreshold={CURRENT_YEAR_IN_CENTURY}
      />
    </StyledMottattVedtaksinstans>
  );
};

const StyledMottattVedtaksinstans = styled.div`
  margin-bottom: 32px;
`;
