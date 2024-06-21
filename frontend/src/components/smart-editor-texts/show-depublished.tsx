import { Checkbox } from '@navikt/ds-react';
import { useSearchParams } from 'react-router-dom';

export const ShowDepublished = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <Checkbox
      checked={searchParams.get('trash') === 'true'}
      onChange={({ target }) => {
        if (target.checked) {
          searchParams.set('trash', 'true');
        } else {
          searchParams.delete('trash');
        }
        setSearchParams(searchParams);
      }}
      size="small"
    >
      Vis avpubliserte
    </Checkbox>
  );
};
