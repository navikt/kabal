import { Tag } from '@navikt/ds-react';
import React from 'react';
import { LoadingCellContent } from '@app/components/common-table-components/loading-cell-content';
import { useFullYtelseNameFromId } from '@app/hooks/use-kodeverk-ids';

interface Props {
  ytelseId: string;
}

export const Ytelse = ({ ytelseId }: Props) => {
  const ytelseName = useFullYtelseNameFromId(ytelseId);

  if (ytelseName === undefined) {
    return <LoadingCellContent />;
  }

  return <Tag variant="alt3">{ytelseName ?? 'Ukjent'}</Tag>;
};
