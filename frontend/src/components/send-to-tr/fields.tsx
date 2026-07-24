import { HStack, Label, TextField, VStack } from '@navikt/ds-react';
import { parse } from 'date-fns';
import { type Dispatch, memo, type SetStateAction, useCallback, useMemo } from 'react';
import { CURRENT_YEAR_IN_CENTURY, FORMAT } from '@/components/date-picker/constants';
import { DatePicker } from '@/components/date-picker/date-picker';
import { SearchableMultiSelect } from '@/components/searchable-select/searchable-multi-select/searchable-multi-select';
import type { Entry } from '@/components/searchable-select/virtualized-option-list';
import {
  FAGSAK_ID,
  HJEMMEL_LIST_ID,
  SAK_MOTTATT_KLAGEINSTANS_ID,
  SENDT_TIL_TRYGDERETTEN_ID,
} from '@/components/send-to-tr/constants';
import type { IValidationSection } from '@/components/send-to-tr/error-summary';
import { OldDateWarning } from '@/components/send-to-tr/old-date-warning';
import type { AnkeFormFields } from '@/components/send-to-tr/types';
import type { IKodeverkValue } from '@/types/kodeverk';

interface FieldsProps {
  formFields: AnkeFormFields;
  setFormFields: Dispatch<SetStateAction<AnkeFormFields>>;
  hjemler: IKodeverkValue[];
  errors: IValidationSection[];
  hasAttemptedSubmit?: boolean;
}

export const Fields = ({ formFields, setFormFields, hjemler, errors }: FieldsProps) => {
  const fieldsErrors = useMemo(
    () =>
      Object.fromEntries(errors.flatMap(({ properties }) => properties.map(({ field, reason }) => [field, reason]))),
    [errors],
  );

  const { sakMottattKlageinstans, sendtTilTrygderetten, hjemmelIdList, fagsakId } = formFields;

  const mottattKlageinstansToDate = useMemo(
    () => (sendtTilTrygderetten === null ? undefined : parse(sendtTilTrygderetten, FORMAT, new Date())),
    [sendtTilTrygderetten],
  );

  const sendtTilTrygderettenFromDate = useMemo(
    () => (sakMottattKlageinstans === null ? undefined : parse(sakMottattKlageinstans, FORMAT, new Date())),
    [sakMottattKlageinstans],
  );

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
    () => options.filter((o) => hjemmelIdList.includes(o.key)),
    [options, hjemmelIdList],
  );

  const setFagsakId = useCallback(
    (value: string) => setFormFields((prev) => ({ ...prev, fagsakId: value })),
    [setFormFields],
  );

  const setSakMottattKlageinstans = useCallback(
    (value: string | null) => setFormFields((prev) => ({ ...prev, sakMottattKlageinstans: value })),
    [setFormFields],
  );

  const setSendtTilTrygderetten = useCallback(
    (value: string | null) => setFormFields((prev) => ({ ...prev, sendtTilTrygderetten: value })),
    [setFormFields],
  );

  const setHjemmelIdList = useCallback(
    (values: IKodeverkValue[]) => setFormFields((prev) => ({ ...prev, hjemmelIdList: values.map((v) => v.id) })),
    [setFormFields],
  );

  return (
    <VStack gap="space-16">
      <HStack gap="space-16" marginBlock="space-8" align="start">
        <FagsakIdField value={fagsakId} onChange={setFagsakId} error={fieldsErrors[FAGSAK_ID]} />

        <div className="w-48">
          <MemoDatePicker
            id={SAK_MOTTATT_KLAGEINSTANS_ID}
            label="Anke mottatt klageinstans"
            onChange={setSakMottattKlageinstans}
            value={sakMottattKlageinstans}
            size="small"
            width={160}
            toDate={mottattKlageinstansToDate}
            error={fieldsErrors[SAK_MOTTATT_KLAGEINSTANS_ID]}
            centuryThreshold={CURRENT_YEAR_IN_CENTURY}
          />
        </div>
        <div className="w-48">
          <MemoDatePicker
            id={SENDT_TIL_TRYGDERETTEN_ID}
            label="Anke sendt til Trygderetten"
            onChange={setSendtTilTrygderetten}
            value={sendtTilTrygderetten}
            size="small"
            width={160}
            fromDate={sendtTilTrygderettenFromDate}
            error={fieldsErrors[SENDT_TIL_TRYGDERETTEN_ID]}
            centuryThreshold={CURRENT_YEAR_IN_CENTURY}
          />
        </div>
        <HjemmelField
          options={options}
          value={selectedValues}
          onChange={setHjemmelIdList}
          error={fieldsErrors[HJEMMEL_LIST_ID]}
        />
      </HStack>

      <OldDateWarning dates={[sakMottattKlageinstans, sendtTilTrygderetten]} />
    </VStack>
  );
};

const MemoDatePicker = memo(DatePicker);

MemoDatePicker.displayName = 'MemoDatePicker';

interface FagsakIdFieldProps {
  value: string;
  onChange: (value: string) => void;
  error: string | undefined;
}

const FagsakIdField = memo(({ value, onChange, error }: FagsakIdFieldProps) => (
  <TextField
    id={FAGSAK_ID}
    label="Arkivsaksnummer (ikke fra Arena)"
    value={value}
    size="small"
    onChange={({ target }) => onChange(target.value)}
    error={error}
    pattern="\d{10}"
    inputMode="numeric"
  />
));

FagsakIdField.displayName = 'FagsakIdField';

interface HjemmelFieldProps {
  options: Entry<IKodeverkValue>[];
  value: Entry<IKodeverkValue>[];
  onChange: (values: IKodeverkValue[]) => void;
  error: string | undefined;
}

const HjemmelField = memo(({ options, value, onChange, error }: HjemmelFieldProps) => (
  <VStack gap="space-6" width="25rem">
    <Label size="small" htmlFor={HJEMMEL_LIST_ID}>
      Hjemmel
    </Label>
    <SearchableMultiSelect
      id={HJEMMEL_LIST_ID}
      label="Hjemmel"
      options={options}
      value={value}
      onChange={onChange}
      emptyLabel="Ingen hjemler valgt"
      error={error}
    />
  </VStack>
));

HjemmelField.displayName = 'HjemmelField';
