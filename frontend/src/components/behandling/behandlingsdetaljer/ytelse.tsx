import { Skeleton, Tag } from '@navikt/ds-react';
import { useFullYtelseNameFromId } from '@/hooks/use-kodeverk-ids';

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
