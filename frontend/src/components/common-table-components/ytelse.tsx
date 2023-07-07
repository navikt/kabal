import React from 'react';
import { LoadingCellContent } from '@app/components/common-table-components/loading-cell-content';
import { useFullYtelseNameFromId } from '@app/hooks/use-kodeverk-ids';
import { LabelTema } from '@app/styled-components/labels';

interface Props {
  ytelseId: string;
}

export const Ytelse = ({ ytelseId }: Props) => {
  const ytelseName = useFullYtelseNameFromId(ytelseId);

  if (ytelseName === undefined) {
    return <LoadingCellContent />;
  }

  return <LabelTema>{ytelseName ?? 'Ukjent'}</LabelTema>;
};
