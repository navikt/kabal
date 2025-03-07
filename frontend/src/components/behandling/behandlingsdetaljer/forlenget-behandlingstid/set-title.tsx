import { useDebounce } from '@app/components/behandling/behandlingsdetaljer/forlenget-behandlingstid/use-debounce';
import { useSetTitleMutation } from '@app/redux-api/forlenget-behandlingstid';
import { ErrorMessage, TextField, VStack } from '@navikt/ds-react';
import { useState } from 'react';

interface Props {
  value: string | null;
  id: string;
}

export const SetTitle = ({ value, id }: Props) => {
  const [setValue] = useSetTitleMutation({ fixedCacheKey: id });
  const [tempValue, setTempValue] = useState(value ?? '');
  const [error, setError] = useState<string>();

  const skip = tempValue === value || (tempValue === '' && value === null);
  useDebounce(() => setValue({ id, title: tempValue }).unwrap(), skip, tempValue, setError, 500);

  return (
    <VStack gap="2">
      <TextField
        label="Tittel"
        size="small"
        value={tempValue}
        onChange={({ target }) => setTempValue(target.value)}
        autoComplete="off"
      />
      {error === undefined ? null : <ErrorMessage size="small">{error}</ErrorMessage>}
    </VStack>
  );
};
