import { Textarea, VStack } from '@navikt/ds-react';
import { useState } from 'react';
import { useDebounce } from '@/components/behandling/behandlingsdetaljer/forlenget-behandlingstid/use-debounce';
import { useSetReasonMutation } from '@/redux-api/forlenget-behandlingstid';

interface Props {
  value: string | null;
  id: string;
}

export const SetReason = ({ value, id }: Props) => {
  const [setValue] = useSetReasonMutation({ fixedCacheKey: id });
  const [tempValue, setTempValue] = useState(value ?? '');

  const skip = tempValue === value || (tempValue === '' && value === null);
  const action = () => setValue({ id, reason: tempValue === '' ? null : tempValue });
  useDebounce(action, skip, tempValue, 500);

  return (
    <VStack gap="space-8">
      <Textarea
        minRows={3}
        maxRows={3}
        label="Oppgi årsak til lengre saksbehandlingstid (valgfri)"
        size="small"
        value={tempValue}
        onChange={({ target }) => setTempValue(target.value)}
      />
    </VStack>
  );
};
