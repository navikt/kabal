import { Skeleton } from '@navikt/ds-react';
import React from 'react';
import { useFullYtelseNameFromId } from '@app/hooks/use-kodeverk-ids';
import { LabelTema } from '@app/styled-components/labels';

interface Props {
  ytelseId: string;
}

export const Ytelse = ({ ytelseId }: Props) => {
  const ytelse = useFullYtelseNameFromId(ytelseId);

  if (ytelse === undefined) {
    return <Skeleton variant="rounded" height={28} width={150} />;
  }

  return <LabelTema>{ytelse}</LabelTema>;
};
