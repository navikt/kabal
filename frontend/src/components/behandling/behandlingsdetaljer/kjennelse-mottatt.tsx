import { ReadOnlyDate } from '@app/components/behandling/behandlingsdetaljer/read-only-date';
import { DateContainer } from '@app/components/behandling/styled-components';
import { CURRENT_YEAR_IN_CENTURY } from '@app/components/date-picker/constants';
import { DatePicker } from '@app/components/date-picker/date-picker';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useCanEditBehandling } from '@app/hooks/use-can-edit';
import { useFieldName } from '@app/hooks/use-field-name';
import { useValidationError } from '@app/hooks/use-validation-error';
import { useSetKjennelseMottattMutation } from '@app/redux-api/oppgaver/mutations/behandling-dates';
import { SaksTypeEnum } from '@app/types/kodeverk';
import { subDays } from 'date-fns';

const ID = 'kjennelse-mottatt';

export const KjennelseMottatt = () => {
  const canEdit = useCanEditBehandling();
  const { data } = useOppgave();
  const error = useValidationError('kjennelseMottatt');
  const label = useFieldName('kjennelseMottatt');
  const [setKjennelseMottatt] = useSetKjennelseMottattMutation();

  if (data?.typeId !== SaksTypeEnum.ANKE_I_TRYGDERETTEN) {
    return null;
  }

  const value = data.kjennelseMottatt?.split('T')[0] ?? null;

  if (!canEdit) {
    return <ReadOnlyDate date={value} id={ID} label={label} />;
  }

  const onChange = (kjennelseMottatt: string | null) => {
    if (kjennelseMottatt !== value) {
      setKjennelseMottatt({ oppgaveId: data.id, kjennelseMottatt, typeId: data.typeId });
    }
  };

  return (
    <DateContainer>
      <DatePicker
        label={label}
        disabled={!canEdit}
        onChange={onChange}
        value={value}
        error={error}
        id={ID}
        size="small"
        centuryThreshold={CURRENT_YEAR_IN_CENTURY}
        warningThreshhold={subDays(new Date(), 360)}
      />
    </DateContainer>
  );
};
