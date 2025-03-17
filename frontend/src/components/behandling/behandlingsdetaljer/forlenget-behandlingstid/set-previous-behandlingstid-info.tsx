import { useDebounce } from '@app/components/behandling/behandlingsdetaljer/forlenget-behandlingstid/use-debounce';
import { useSetPreviousBehandlingstidInfoMutation } from '@app/redux-api/forlenget-behandlingstid';
import { Textarea, VStack } from '@navikt/ds-react';
import { useState } from 'react';

interface Props {
  value: string | null;
  id: string;
}

export const SetPreviousBehandlingstidInfo = ({ value, id }: Props) => {
  const [setValue] = useSetPreviousBehandlingstidInfoMutation({ fixedCacheKey: id });
  const [tempValue, setTempValue] = useState(value ?? '');

  const skip = tempValue === value || (tempValue === '' && value === null);
  const action = () => setValue({ id, previousBehandlingstidInfo: tempValue === '' ? null : tempValue });
  useDebounce(action, skip, tempValue, 500);

  return (
    <VStack gap="2">
      <Textarea
        minRows={2}
        maxRows={2}
        label="Info om forrige behandlingstid"
        size="small"
        value={tempValue}
        onChange={({ target }) => setTempValue(target.value)}
      />
    </VStack>
  );
};
