import { Skeleton, Tag } from '@navikt/ds-react';
import React from 'react';
import { useFullYtelseNameFromId } from '@app/hooks/use-kodeverk-ids';

interface Props {
  ytelseId: string;
}

export const Ytelse = ({ ytelseId }: Props) => {
  const ytelse = useFullYtelseNameFromId(ytelseId);

  if (ytelse === undefined) {
    return <Skeleton variant="rounded" height={24} width={150} />;
  }

  return (
    <Tag variant="alt3" size="small">
      {ytelse}
    </Tag>
  );
};
