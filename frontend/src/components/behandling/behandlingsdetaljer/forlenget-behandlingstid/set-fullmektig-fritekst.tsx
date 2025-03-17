import { useDebounce } from '@app/components/behandling/behandlingsdetaljer/forlenget-behandlingstid/use-debounce';
import { useSetFullmektigFritekstMutation } from '@app/redux-api/forlenget-behandlingstid';
import { TextField, VStack } from '@navikt/ds-react';
import { useState } from 'react';

interface Props {
  value: string | null;
  id: string;
}

export const SetFullmektigFritekst = ({ value, id }: Props) => {
  const [setValue] = useSetFullmektigFritekstMutation({ fixedCacheKey: id });
  const [tempValue, setTempValue] = useState(value ?? '');

  const skip = tempValue === value || (tempValue === '' && value === null);
  const action = () => setValue({ id, fullmektigFritekst: tempValue === '' ? null : tempValue });
  useDebounce(action, skip, tempValue, 500);

  return (
    <VStack gap="2">
      <TextField
        label="Navn på fullmektig i brevet"
        size="small"
        value={tempValue}
        onChange={({ target }) => setTempValue(target.value)}
      />
    </VStack>
  );
};
