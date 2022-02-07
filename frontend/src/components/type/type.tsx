import React from 'react';
import { useTypeNameFromId } from '../../hooks/use-kodeverk-ids';
import { LabelType } from '../../styled-components/labels';
import { OppgaveType } from '../../types/kodeverk';

interface Props {
  type: OppgaveType;
}

export const Type = ({ type }: Props) => <LabelType type={type}>{useTypeNameFromId(type)}</LabelType>;
