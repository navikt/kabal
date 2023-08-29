import { Skeleton, TagProps } from '@navikt/ds-react';
import React from 'react';
import { useTypeNameFromId } from '@app/hooks/use-kodeverk-ids';
import { TypeTag } from '@app/styled-components/labels';
import { SaksTypeEnum } from '@app/types/kodeverk';

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
