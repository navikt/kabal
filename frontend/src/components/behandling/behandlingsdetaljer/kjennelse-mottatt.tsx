import { subDays } from 'date-fns';
import { useState } from 'react';
import { ReadOnlyDate } from '@/components/behandling/behandlingsdetaljer/read-only-date';
import { DateContainer } from '@/components/behandling/styled-components';
import { CURRENT_YEAR_IN_CENTURY } from '@/components/date-picker/constants';
import { DatePicker } from '@/components/date-picker/date-picker';
import { useOppgave } from '@/hooks/oppgavebehandling/use-oppgave';
import { useCanEditBehandling } from '@/hooks/use-can-edit';
import { useFieldName } from '@/hooks/use-field-name';
import { useValidationError } from '@/hooks/use-validation-error';
import { useSetKjennelseMottattMutation } from '@/redux-api/oppgaver/mutations/behandling-dates';
import { SaksTypeEnum } from '@/types/kodeverk';

const ID = 'kjennelse-mottatt';

export const KjennelseMottatt = () => {
  const canEdit = useCanEditBehandling();
  const { data } = useOppgave();
  const error = useValidationError('kjennelseMottatt');
  const [localError, setLocalError] = useState<string | null>(null);
  const label = useFieldName('kjennelseMottatt');
  const [setKjennelseMottatt] = useSetKjennelseMottattMutation();

  if (data?.typeId !== SaksTypeEnum.ANKE_I_TRYGDERETTEN && data?.typeId !== SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK_I_TR) {
    return null;
  }

  const value = data.kjennelseMottatt?.split('T')[0] ?? null;

  if (!canEdit) {
    return <ReadOnlyDate date={value} id={ID} label={label} />;
  }

  const onChange = (kjennelseMottatt: string | null) => {
    setLocalError(null);

    if (kjennelseMottatt === value) {
      return;
    }

    if (kjennelseMottatt === null) {
      return setKjennelseMottatt({ oppgaveId: data.id, kjennelseMottatt, typeId: data.typeId });
    }

    const sendtTilTrygderetten = data.sendtTilTrygderetten?.split('T')[0] ?? null;

    if (sendtTilTrygderetten !== null && sendtTilTrygderetten >= kjennelseMottatt) {
      setLocalError('Kjennelse mottatt må være etter Sendt til Trygderetten.');
    }

    setKjennelseMottatt({ oppgaveId: data.id, kjennelseMottatt, typeId: data.typeId });
  };

  return (
    <DateContainer>
      <DatePicker
        label={label}
        disabled={!canEdit}
        onChange={onChange}
        value={value}
        error={localError || error}
        id={ID}
        size="small"
        centuryThreshold={CURRENT_YEAR_IN_CENTURY}
        warningThreshhold={subDays(new Date(), 360)}
      />
    </DateContainer>
  );
};
