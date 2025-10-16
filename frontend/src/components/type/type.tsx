import { SAKSTYPE_TO_TAG_VARIANT } from '@app/components/type/sakstype-to-tag-variant';
import { useTypeNameFromId } from '@app/hooks/use-kodeverk-ids';
import type { SaksTypeEnum } from '@app/types/kodeverk';
import { Skeleton, Tag, type TagProps } from '@navikt/ds-react';

interface Props {
  type: SaksTypeEnum;
  size?: TagProps['size'];
}

export const Type = ({ type, size = 'small' }: Props) => {
  const typeName = useTypeNameFromId(type);

  if (typeName === undefined) {
    return <Skeleton variant="rounded" height={24} width={55} />;
  }

  return (
    <Tag variant={SAKSTYPE_TO_TAG_VARIANT[type]} size={size} className="truncate">
      {typeName}
    </Tag>
  );
};
