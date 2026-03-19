import { Tag } from '@navikt/ds-react';
import { LoadingCellContent } from '@/components/common-table-components/loading-cell-content';
import { useFullYtelseNameFromId } from '@/hooks/use-kodeverk-ids';

interface Props {
  ytelseId: string;
}

export const Ytelse = ({ ytelseId }: Props) => {
  const ytelseName = useFullYtelseNameFromId(ytelseId);

  if (ytelseName === undefined) {
    return <LoadingCellContent />;
  }

  return (
    <Tag data-color="info" variant="outline" className="truncate">
      {ytelseName ?? 'Ukjent'}
    </Tag>
  );
};
