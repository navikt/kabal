import { useDebounce } from '@app/components/behandling/behandlingsdetaljer/forlenget-behandlingstid/use-debounce';
import { useSetReasonMutation } from '@app/redux-api/forlenget-behandlingstid';
import { ErrorMessage, Textarea, VStack } from '@navikt/ds-react';
import { useState } from 'react';

interface Props {
  value: string | null;
  id: string;
}

export const SetReason = ({ value, id }: Props) => {
  const [setValue] = useSetReasonMutation({ fixedCacheKey: id });
  const [tempValue, setTempValue] = useState(value ?? '');
  const [error, setError] = useState<string>();

  const skip = tempValue === value || (tempValue === '' && value === null);
  useDebounce(() => setValue({ id, reason: tempValue }).unwrap(), 500, skip, setError);

  return (
    <VStack gap="2">
      <Textarea
        minRows={3}
        maxRows={3}
        label="Oppgi årsak til lengre saksbehandlingstid (valgfri)"
        size="small"
        value={tempValue}
        onChange={({ target }) => setTempValue(target.value)}
      />
      {error === undefined ? null : <ErrorMessage size="small">{error}</ErrorMessage>}
    </VStack>
  );
};
