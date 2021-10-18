import React from 'react';
import { useTypeFromId } from '../../hooks/use-kodeverk-ids';
import { LabelMain } from '../../styled-components/labels';

interface Props {
  type: string;
}

export const Type = ({ type }: Props) => <LabelMain>{useTypeFromId(type)}</LabelMain>;
