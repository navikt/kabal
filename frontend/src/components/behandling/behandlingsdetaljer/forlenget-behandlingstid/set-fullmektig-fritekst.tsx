import { useDebounce } from '@app/components/behandling/behandlingsdetaljer/forlenget-behandlingstid/use-debounce';
import { useSetFullmektigFritekstMutation } from '@app/redux-api/forlenget-behandlingstid';
import { ErrorMessage, TextField, VStack } from '@navikt/ds-react';
import { useState } from 'react';

interface Props {
  value: string | null;
  id: string;
}

export const SetFullmektigFritekst = ({ value, id }: Props) => {
  const [setValue] = useSetFullmektigFritekstMutation({ fixedCacheKey: id });
  const [tempValue, setTempValue] = useState(value ?? '');
  const [error, setError] = useState<string>();

  const skip = tempValue === value || (tempValue === '' && value === null);
  const action = () => setValue({ id, fullmektigFritekst: tempValue === '' ? null : tempValue }).unwrap();

  useDebounce(action, skip, tempValue, setError, 500);

  return (
    <VStack gap="2">
      <TextField
        label="Navn på fullmektig i brevet"
        size="small"
        value={tempValue}
        onChange={({ target }) => setTempValue(target.value)}
      />
      {error === undefined ? null : <ErrorMessage size="small">{error}</ErrorMessage>}
    </VStack>
  );
};
