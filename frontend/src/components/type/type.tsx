import React from 'react';
import { useTypeNameFromId } from '@app/hooks/use-kodeverk-ids';
import { LabelType } from '@app/styled-components/labels';
import { SaksTypeEnum } from '@app/types/kodeverk';

interface Props {
  type: SaksTypeEnum;
}

export const Type = ({ type }: Props) => <LabelType type={type}>{useTypeNameFromId(type)}</LabelType>;
