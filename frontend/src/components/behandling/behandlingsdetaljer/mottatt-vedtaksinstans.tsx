import { subDays } from 'date-fns';
import { ReadOnlyDate } from '@/components/behandling/behandlingsdetaljer/read-only-date';
import { DateContainer } from '@/components/behandling/styled-components';
import { CURRENT_YEAR_IN_CENTURY } from '@/components/date-picker/constants';
import { DatePicker } from '@/components/date-picker/date-picker';
import { useOppgave } from '@/hooks/oppgavebehandling/use-oppgave';
import { useCanEditBehandling } from '@/hooks/use-can-edit';
import { useFieldName } from '@/hooks/use-field-name';
import { useValidationError } from '@/hooks/use-validation-error';
import { useSetMottattVedtaksinstansMutation } from '@/redux-api/oppgaver/mutations/behandling-dates';
import { SaksTypeEnum } from '@/types/kodeverk';

const ID = 'mottatt-vedtaksinstans';

export const MottattVedtaksinstans = () => {
  const canEdit = useCanEditBehandling();
  const { data } = useOppgave();
  const error = useValidationError('mottattVedtaksinstans');
  const label = useFieldName('mottattVedtaksinstans');
  const [setMottattVedtaksinstans] = useSetMottattVedtaksinstansMutation();

  if (data?.typeId !== SaksTypeEnum.KLAGE) {
    return null;
  }

  const value = data?.mottattVedtaksinstans ?? null;

  if (!canEdit) {
    return <ReadOnlyDate date={value} id={ID} label={label} />;
  }

  return (
    <DateContainer>
      <DatePicker
        label={label}
        disabled={!canEdit}
        onChange={(mottattVedtaksinstans) => {
          if (mottattVedtaksinstans !== null && mottattVedtaksinstans !== value) {
            setMottattVedtaksinstans({ oppgaveId: data.id, mottattVedtaksinstans, typeId: data.typeId });
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
