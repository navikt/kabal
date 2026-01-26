import { useFullYtelseNameFromId } from '@app/hooks/use-kodeverk-ids';
import { Skeleton, Tag } from '@navikt/ds-react';

interface Props {
  ytelseId: string;
}

export const Ytelse = ({ ytelseId }: Props) => {
  const ytelse = useFullYtelseNameFromId(ytelseId);

  if (ytelse === undefined) {
    return <Skeleton variant="rounded" height={24} width={150} />;
  }

  return (
    <Tag data-color="info" variant="outline" size="small">
      {ytelse}
    </Tag>
  );
};
