import { ErrorMessage, TextField, VStack } from '@navikt/ds-react';
import { useState } from 'react';
import { useDebounce } from '@/components/behandling/behandlingsdetaljer/forlenget-behandlingstid/use-debounce';
import { useSetTitleMutation } from '@/redux-api/forlenget-behandlingstid';
import { UTVIDET_BEHANDLINGSTID_FIELD_NAMES, UtvidetBehandlingstidFieldName } from '@/types/field-names';

interface Props {
  value: string | null;
  id: string;
}

export const SetTitle = ({ value, id }: Props) => {
  const [setValue] = useSetTitleMutation({ fixedCacheKey: id });
  const [tempValue, setTempValue] = useState(value ?? '');
  const [error, setError] = useState<string>();

  const skip = tempValue === value || (tempValue === '' && value === null);
  useDebounce(() => setValue({ id, title: tempValue }), skip, tempValue, 500);

  return (
    <VStack gap="space-8">
      <TextField
        id={UtvidetBehandlingstidFieldName.Title}
        label={UTVIDET_BEHANDLINGSTID_FIELD_NAMES[UtvidetBehandlingstidFieldName.Title]}
        size="small"
        value={tempValue}
        onChange={({ target }) => setTempValue(target.value)}
        onBlur={() => {
          if (tempValue === '') {
            setError('Tittel kan ikke være tom');
          } else {
            setError(undefined);
          }
        }}
        autoComplete="off"
      />
      {error === undefined ? null : <ErrorMessage size="small">{error}</ErrorMessage>}
    </VStack>
  );
};
