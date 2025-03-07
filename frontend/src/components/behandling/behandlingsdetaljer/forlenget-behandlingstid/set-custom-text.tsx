import { useDebounce } from '@app/hooks/use-debounce';
import { useSetCustomTextMutation } from '@app/redux-api/forlenget-behandlingstid';
import { Textarea } from '@navikt/ds-react';
import { useState } from 'react';

interface Props {
  value: string | null;
  id: string;
}

export const SetCustomText = ({ value, id }: Props) => {
  const [setValue] = useSetCustomTextMutation({ fixedCacheKey: id });
  const [tempValue, setTempValue] = useState(value ?? '');

  const skip = tempValue === value || (tempValue === '' && value === null);
  useDebounce(() => setValue({ id, customText: tempValue }), 500, skip);

  return (
    <Textarea
      minRows={3}
      maxRows={3}
      label="Fritekst (valgfri)"
      size="small"
      value={tempValue}
      onChange={({ target }) => setTempValue(target.value)}
    />
  );
};
