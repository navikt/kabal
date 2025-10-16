import { ReadOnlyDate } from '@app/components/behandling/behandlingsdetaljer/read-only-date';
import { DateContainer } from '@app/components/behandling/styled-components';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useCanEditBehandling } from '@app/hooks/use-can-edit';
import { useFieldName } from '@app/hooks/use-field-name';
import { useValidationError } from '@app/hooks/use-validation-error';
import { useSetSendtTilTrygderettenMutation } from '@app/redux-api/oppgaver/mutations/behandling-dates';
import { SaksTypeEnum } from '@app/types/kodeverk';
import { subDays } from 'date-fns';
import { useState } from 'react';
import { CURRENT_YEAR_IN_CENTURY } from '../../date-picker/constants';
import { DatePicker } from '../../date-picker/date-picker';

const ID = 'sendt-til-trygderetten';

export const SendtTilTrygderetten = () => {
  const canEdit = useCanEditBehandling();
  const { data } = useOppgave();
  const error = useValidationError('sendtTilTrygderetten');
  const [localError, setLocalError] = useState<string | null>(null);
  const label = useFieldName('sendtTilTrygderetten');
  const [setSendtTilTrygderetten] = useSetSendtTilTrygderettenMutation();

  if (data?.typeId !== SaksTypeEnum.ANKE_I_TRYGDERETTEN && data?.typeId !== SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK_I_TR) {
    return null;
  }

  const value = data.sendtTilTrygderetten?.split('T')[0] ?? null;

  if (!canEdit) {
    return <ReadOnlyDate date={value} id={ID} label={label} />;
  }

  return (
    <DateContainer>
      <DatePicker
        label={label}
        disabled={!canEdit}
        onChange={(sendtTilTrygderetten) => {
          setLocalError(null);

          if (sendtTilTrygderetten === null || sendtTilTrygderetten === value) {
            return;
          }

          const kjennelseMottatt = data.kjennelseMottatt?.split('T')[0] ?? null;

          if (kjennelseMottatt !== null && sendtTilTrygderetten >= kjennelseMottatt) {
            setLocalError('Sendt til Trygderetten må være før Kjennelse mottatt.');
          }

          setSendtTilTrygderetten({ oppgaveId: data.id, sendtTilTrygderetten, typeId: data.typeId });
        }}
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
