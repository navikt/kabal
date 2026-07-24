import { HStack, Label, TextField, VStack } from '@navikt/ds-react';
import { type SetStateAction, useMemo, useState } from 'react';
import { CURRENT_YEAR_IN_CENTURY } from '@/components/date-picker/constants';
import { DatePicker } from '@/components/date-picker/date-picker';
import { SearchableMultiSelect } from '@/components/searchable-select/searchable-multi-select/searchable-multi-select';
import type { Entry } from '@/components/searchable-select/virtualized-option-list';
import type { GosysOppgaveState } from '@/components/send-til-tr-temp/registrer-anke';
import { useValidationError } from '@/hooks/use-validation-error';
import type { IKodeverkValue } from '@/types/kodeverk';

interface GosysOppgaveFieldsProps {
  oppgaveFields: GosysOppgaveState;
  setOppgaveFields: React.Dispatch<SetStateAction<GosysOppgaveState>>;
  hjemler: IKodeverkValue[];
}

export const GosysOppgaveFields = ({ oppgaveFields, setOppgaveFields, hjemler }: GosysOppgaveFieldsProps) => {
  const [localError, setLocalError] = useState<string | null>(null);
  const validationError = useValidationError('hjemmel');

  const options = useMemo<Entry<IKodeverkValue>[]>(
    () =>
      hjemler.map((o) => ({
        value: o,
        key: o.id,
        label: o.beskrivelse,
        plainText: o.beskrivelse,
      })),
    [hjemler],
  );

  const selectedValues = useMemo<Entry<IKodeverkValue>[]>(
    () => options.filter((o) => oppgaveFields?.hjemmelIdList.includes(o.key)),
    [options, oppgaveFields?.hjemmelIdList],
  );

  const handleChange = (values: IKodeverkValue[]) => {
    setOppgaveFields({ ...oppgaveFields, hjemmelIdList: values.length === 0 ? [] : values.map((v) => v.id) });
  };

  const handleDateChange = (field: 'sakMottattKlageinstans' | 'sendtTilTrygderetten', value: string | null) => {
    const updated = { ...oppgaveFields, [field]: value };
    setOppgaveFields(updated);

    if (
      updated.sakMottattKlageinstans &&
      updated.sendtTilTrygderetten &&
      updated.sendtTilTrygderetten < updated.sakMottattKlageinstans
    ) {
      setLocalError('Sendt til Trygderetten må være etter Mottatt klageinstans.');
    } else {
      setLocalError(null);
    }
  };

  return (
    <HStack gap="space-16" marginBlock="space-8">
      <VStack gap="space-4">
        <TextField
          label="Saksnummer"
          value={oppgaveFields.fagsakId}
          size="small"
          onChange={(e) => setOppgaveFields({ ...oppgaveFields, fagsakId: e.target.value })}
        />
      </VStack>
      <VStack gap="space-4">
        <DatePicker
          id="sakMottattKlageinstans"
          label="Anke mottatt klageinstans"
          onChange={(value) => handleDateChange('sakMottattKlageinstans', value)}
          value={oppgaveFields.sakMottattKlageinstans}
          size="small"
          width={160}
          centuryThreshold={CURRENT_YEAR_IN_CENTURY}
        />
      </VStack>
      <VStack gap="space-4" width="12rem">
        <DatePicker
          id="sendtTilTrygderetten"
          label="Anke sendt til Trygderetten"
          onChange={(value) => handleDateChange('sendtTilTrygderetten', value)}
          value={oppgaveFields.sendtTilTrygderetten}
          size="small"
          error={localError ?? undefined}
          width={160}
          centuryThreshold={CURRENT_YEAR_IN_CENTURY}
        />
      </VStack>
      <VStack gap="space-4" width="25rem">
        <HStack align="center" gap="space-8" marginBlock="space-2" wrap={false}>
          <Label size="small">Hjemmel</Label>
        </HStack>
        <SearchableMultiSelect
          label="Hjemmel"
          options={options}
          value={selectedValues}
          onChange={handleChange}
          emptyLabel="Ingen hjemler valgt"
          error={validationError}
        />
      </VStack>
    </HStack>
  );
};
