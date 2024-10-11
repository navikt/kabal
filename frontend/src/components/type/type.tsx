import { useTypeNameFromId } from '@app/hooks/use-kodeverk-ids';
import { TypeTag } from '@app/styled-components/labels';
import type { SaksTypeEnum } from '@app/types/kodeverk';
import { Skeleton, type TagProps } from '@navikt/ds-react';

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
    <TypeTag $type={type} variant="neutral" size={size}>
      {typeName}
    </TypeTag>
  );
};
