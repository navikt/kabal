import { ReadOnlyDate } from '@app/components/behandling/behandlingsdetaljer/read-only-date';
import { DateContainer } from '@app/components/behandling/styled-components';
import { CURRENT_YEAR_IN_CENTURY } from '@app/components/date-picker/constants';
import { DatePicker } from '@app/components/date-picker/date-picker';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useCanEditBehandling } from '@app/hooks/use-can-edit';
import { useFieldName } from '@app/hooks/use-field-name';
import { useValidationError } from '@app/hooks/use-validation-error';
import { useSetMottattKlageinstansMutation } from '@app/redux-api/oppgaver/mutations/behandling-dates';
import { SaksTypeEnum } from '@app/types/kodeverk';
import { subDays } from 'date-fns';

const ID = 'mottatt-dato';

export const MottattDato = () => {
  const canEdit = useCanEditBehandling();
  const { data } = useOppgave();
  const error = useValidationError('mottattKlageinstans');
  const label = useFieldName('mottattKlageinstans');
  const [setMottattKlageinstans] = useSetMottattKlageinstansMutation();

  if (data?.typeId !== SaksTypeEnum.ANKE && data?.typeId !== SaksTypeEnum.OMGJØRINGSKRAV) {
    return null;
  }

  const value = data?.mottattKlageinstans ?? null;

  if (!canEdit) {
    return <ReadOnlyDate date={value} id={ID} label={label} />;
  }

  return (
    <DateContainer>
      <DatePicker
        label={label}
        disabled={!canEdit}
        onChange={(mottattKlageinstans) => {
          if (mottattKlageinstans !== null && mottattKlageinstans !== value) {
            setMottattKlageinstans({ oppgaveId: data.id, mottattKlageinstans });
          }
        }}
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
