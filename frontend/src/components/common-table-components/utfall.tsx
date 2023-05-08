import { Loader } from '@navikt/ds-react';
import React, { useMemo } from 'react';
import { useUtfall } from '@app/simple-api-state/use-kodeverk';

interface Props {
  utfallId: string | null;
}

export const Utfall = ({ utfallId }: Props): JSX.Element => {
  const { data: utfallList } = useUtfall();

  const children = useMemo(() => {
    if (typeof utfallList === 'undefined') {
      return <Loader size="small" />;
    }

    return utfallList.find((u) => u.id === utfallId)?.navn;
  }, [utfallList, utfallId]);

  return <>{children}</>;
};
