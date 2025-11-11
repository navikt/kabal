import { SAKSTYPE_TO_TAG_VARIANT } from '@app/components/type/sakstype-to-tag-variant';
import { useFullYtelseNameFromId, useTypeNameFromId } from '@app/hooks/use-kodeverk-ids';
import type { SaksTypeEnum } from '@app/types/kodeverk';
import { Skeleton, Tag, type TagProps, Tooltip } from '@navikt/ds-react';

interface TypeProps {
  typeId: SaksTypeEnum;
  size?: TagProps['size'];
}

export const Type = ({ typeId, size = 'small' }: TypeProps) => {
  const typeName = useTypeNameFromId(typeId);

  if (typeName === undefined) {
    return <Skeleton variant="rounded" height={24} width={55} />;
  }

  return (
    <Tooltip content={typeName}>
      <Tag variant={SAKSTYPE_TO_TAG_VARIANT[typeId]} size={size} className="truncate">
        <span className="truncate">{typeName}</span>
      </Tag>
    </Tooltip>
  );
};

interface Props {
  ytelseId: string;
}

export const Ytelse = ({ ytelseId }: Props) => {
  const ytelse = useFullYtelseNameFromId(ytelseId);

  if (ytelse === undefined) {
    return <Skeleton variant="rounded" height={24} width={150} />;
  }

  return (
    <Tooltip content={ytelse}>
      <Tag variant="alt3" size="small" className="truncate">
        <span className="truncate">{ytelse}</span>
      </Tag>
    </Tooltip>
  );
};
