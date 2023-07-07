import { Skeleton } from '@navikt/ds-react';
import React from 'react';
import { useTypeNameFromId } from '@app/hooks/use-kodeverk-ids';
import { LabelType } from '@app/styled-components/labels';
import { SaksTypeEnum } from '@app/types/kodeverk';

interface Props {
  type: SaksTypeEnum;
}

export const Type = ({ type }: Props) => {
  const typeName = useTypeNameFromId(type);

  if (typeName === undefined) {
    return <Skeleton variant="rounded" height={28} width={55} />;
  }

  return <LabelType type={type}>{typeName}</LabelType>;
};
