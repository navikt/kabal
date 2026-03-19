import { subDays } from 'date-fns';
import { ReadOnlyDate } from '@/components/behandling/behandlingsdetaljer/read-only-date';
import { DateContainer } from '@/components/behandling/styled-components';
import { CURRENT_YEAR_IN_CENTURY } from '@/components/date-picker/constants';
import { DatePicker } from '@/components/date-picker/date-picker';
import { useOppgave } from '@/hooks/oppgavebehandling/use-oppgave';
import { useCanEditBehandling } from '@/hooks/use-can-edit';
import { useFieldName } from '@/hooks/use-field-name';
import { useValidationError } from '@/hooks/use-validation-error';
import { useSetMottattKlageinstansMutation } from '@/redux-api/oppgaver/mutations/behandling-dates';
import { SaksTypeEnum } from '@/types/kodeverk';

const ID = 'mottatt-dato';

export const MottattDato = () => {
  const canEdit = useCanEditBehandling();
  const { data } = useOppgave();
  const error = useValidationError('mottattKlageinstans');
  const label = useFieldName('mottattKlageinstans');
  const [setMottattKlageinstans] = useSetMottattKlageinstansMutation();

  if (
    data?.typeId !== SaksTypeEnum.ANKE &&
    data?.typeId !== SaksTypeEnum.OMGJØRINGSKRAV &&
    data?.typeId !== SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK
  ) {
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
