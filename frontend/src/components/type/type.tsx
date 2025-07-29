import { useTypeNameFromId } from '@app/hooks/use-kodeverk-ids';
import { SaksTypeEnum } from '@app/types/kodeverk';
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
    <Tag variant={VARIANT[type]} size={size} className="truncate">
      {typeName}
    </Tag>
  );
};

const VARIANT: Record<SaksTypeEnum, TagProps['variant']> = {
  [SaksTypeEnum.KLAGE]: 'info-moderate',
  [SaksTypeEnum.ANKE]: 'alt1-moderate',
  [SaksTypeEnum.ANKE_I_TRYGDERETTEN]: 'neutral-moderate',
  [SaksTypeEnum.OMGJØRINGSKRAV]: 'warning-moderate',
  [SaksTypeEnum.BEHANDLING_ETTER_TR_OPPHEVET]: 'alt2-moderate',
};
