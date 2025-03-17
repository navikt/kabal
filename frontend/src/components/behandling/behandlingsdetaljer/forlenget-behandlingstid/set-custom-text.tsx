import { useDebounce } from '@app/components/behandling/behandlingsdetaljer/forlenget-behandlingstid/use-debounce';
import { useSetCustomTextMutation } from '@app/redux-api/forlenget-behandlingstid';
import { Textarea, VStack } from '@navikt/ds-react';
import { useState } from 'react';

interface Props {
  value: string | null;
  id: string;
}

export const SetCustomText = ({ value, id }: Props) => {
  const [setValue] = useSetCustomTextMutation({ fixedCacheKey: id });
  const [tempValue, setTempValue] = useState(value ?? '');

  const skip = tempValue === value || (tempValue === '' && value === null);
  const action = () => setValue({ id, customText: tempValue === '' ? null : tempValue });
  useDebounce(action, skip, tempValue, 500);

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
    </VStack>
  );
};
