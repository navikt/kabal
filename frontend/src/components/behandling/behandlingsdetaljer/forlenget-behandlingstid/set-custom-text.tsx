import { useDebounce } from '@app/components/behandling/behandlingsdetaljer/forlenget-behandlingstid/use-debounce';
import { useSetCustomTextMutation } from '@app/redux-api/forlenget-behandlingstid';
import { ErrorMessage, Textarea, VStack } from '@navikt/ds-react';
import { useState } from 'react';

interface Props {
  value: string | null;
  id: string;
}

export const SetCustomText = ({ value, id }: Props) => {
  const [setValue] = useSetCustomTextMutation({ fixedCacheKey: id });
  const [tempValue, setTempValue] = useState(value ?? '');
  const [error, setError] = useState<string>();

  const skip = tempValue === value || (tempValue === '' && value === null);
  const action = () => setValue({ id, customText: tempValue === '' ? null : tempValue }).unwrap();
  useDebounce(action, skip, tempValue, setError, 500);

  return (
    <VStack gap="2">
      <Textarea
        minRows={3}
        maxRows={3}
        label="Fritekst (valgfri)"
        size="small"
        value={tempValue}
        onChange={({ target }) => setTempValue(target.value)}
      />
      {error === undefined ? null : <ErrorMessage size="small">{error}</ErrorMessage>}
    </VStack>
  );
};
