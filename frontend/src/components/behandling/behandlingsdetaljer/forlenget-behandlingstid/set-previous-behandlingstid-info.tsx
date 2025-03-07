import { useDebounce } from '@app/hooks/use-debounce';
import { useSetPreviousBehandlingstidInfoMutation } from '@app/redux-api/forlenget-behandlingstid';
import { Textarea } from '@navikt/ds-react';
import { useState } from 'react';

interface Props {
  value: string | null;
  id: string;
}

export const SetPreviousBehandlingstidInfo = ({ value, id }: Props) => {
  const [setValue] = useSetPreviousBehandlingstidInfoMutation({ fixedCacheKey: id });
  const [tempValue, setTempValue] = useState(value ?? '');

  const skip = tempValue === value || (tempValue === '' && value === null);
  useDebounce(() => setValue({ id, previousBehandlingstidInfo: tempValue }), 500, skip);

  return (
    <Textarea
      minRows={2}
      maxRows={2}
      label="Info om forrige behandlingstid"
      size="small"
      value={tempValue}
      onChange={({ target }) => setTempValue(target.value)}
    />
  );
};
