import { useDebounce } from '@app/hooks/use-debounce';
import { useSetTitleMutation } from '@app/redux-api/forlenget-behandlingstid';
import { TextField } from '@navikt/ds-react';
import { useState } from 'react';

interface Props {
  value: string | null;
  id: string;
}

export const SetTitle = ({ value, id }: Props) => {
  const [setValue] = useSetTitleMutation({ fixedCacheKey: id });
  const [tempValue, setTempValue] = useState(value ?? '');

  const skip = tempValue === value || (tempValue === '' && value === null);
  useDebounce(() => setValue({ id, title: tempValue }), 500, skip);

  return (
    <TextField label="Tittel" size="small" value={tempValue} onChange={({ target }) => setTempValue(target.value)} />
  );
};
