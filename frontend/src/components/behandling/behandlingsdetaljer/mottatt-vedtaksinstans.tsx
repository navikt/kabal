import React from 'react';
import styled from 'styled-components';
import { useOppgave } from '../../../hooks/oppgavebehandling/use-oppgave';
import { useCanEdit } from '../../../hooks/use-can-edit';
import { useValidationError } from '../../../hooks/use-validation-error';
import { useSetMottattVedtaksinstansMutation } from '../../../redux-api/oppgaver/mutations/behandling';
import { SaksTypeEnum } from '../../../types/kodeverk';
import { CURRENT_YEAR_IN_CENTURY } from '../../date-picker/constants';
import { DatePicker } from '../../date-picker/date-picker';

export const MottattVedtaksinstans = () => {
  const canEdit = useCanEdit();
  const { data } = useOppgave();
  const error = useValidationError('mottattVedtaksinstans');
  const [setMottattVedtaksinstans] = useSetMottattVedtaksinstansMutation();

  if (data?.type !== SaksTypeEnum.KLAGE) {
    return null;
  }

  return (
    <StyledMottattVedtaksinstans>
      <DatePicker
        label="Mottatt vedtaksinstans"
        disabled={!canEdit}
        onChange={(mottattVedtaksinstans) => {
          if (mottattVedtaksinstans !== null) {
            setMottattVedtaksinstans({ oppgaveId: data.id, mottattVedtaksinstans, type: data.type });
          }
        }}
        value={data?.mottattVedtaksinstans ?? null}
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
