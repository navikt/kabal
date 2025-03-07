import { useDebounce } from '@app/hooks/use-debounce';
import { useSetReasonMutation } from '@app/redux-api/forlenget-behandlingstid';
import { Textarea } from '@navikt/ds-react';
import { useState } from 'react';

interface Props {
  value: string | null;
  id: string;
}

export const SetReason = ({ value, id }: Props) => {
  const [setValue] = useSetReasonMutation({ fixedCacheKey: id });
  const [tempValue, setTempValue] = useState(value ?? '');

  const skip = tempValue === value || (tempValue === '' && value === null);
  useDebounce(() => setValue({ id, reason: tempValue }), 500, skip);

  return (
    <Textarea
      minRows={3}
      maxRows={3}
      label="Oppgi årsak til lengre saksbehandlingstid (valgfri)"
      size="small"
      value={tempValue}
      onChange={({ target }) => setTempValue(target.value)}
    />
  );
};
