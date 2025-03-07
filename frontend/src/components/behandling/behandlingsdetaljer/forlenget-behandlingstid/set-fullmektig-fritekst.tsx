import { useDebounce } from '@app/hooks/use-debounce';
import { useSetFullmektigFritekstMutation } from '@app/redux-api/forlenget-behandlingstid';
import { TextField } from '@navikt/ds-react';
import { useState } from 'react';

interface Props {
  value: string | null;
  id: string;
}

export const SetFullmektigFritekst = ({ value, id }: Props) => {
  const [setValue] = useSetFullmektigFritekstMutation({ fixedCacheKey: id });
  const [tempValue, setTempValue] = useState(value ?? '');

  const skip = tempValue === value || (tempValue === '' && value === null);
  useDebounce(() => setValue({ id, fullmektigFritekst: tempValue }), 500, skip);

  return (
    <TextField
      label="Navn på fullmektig i brevet"
      size="small"
      value={tempValue}
      onChange={({ target }) => setTempValue(target.value)}
    />
  );
};
