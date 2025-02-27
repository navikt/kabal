import { LoadingCellContent } from '@app/components/common-table-components/loading-cell-content';
import { useUtfall } from '@app/simple-api-state/use-kodeverk';
import { useMemo } from 'react';

interface Props {
  utfallId: string | null;
}

export const Utfall = ({ utfallId }: Props): React.JSX.Element => {
  const { data: utfallList } = useUtfall();

  const children = useMemo(() => {
    if (typeof utfallList === 'undefined') {
      return <LoadingCellContent />;
    }

    return utfallList.find((u) => u.id === utfallId)?.navn;
  }, [utfallList, utfallId]);

  return <>{children}</>;
};
