import React from 'react';
import { useTypeNameFromId } from '../../hooks/use-kodeverk-ids';
import { LabelMain } from '../../styled-components/labels';
import { OppgaveType } from '../../types/kodeverk';

interface Props {
  type: OppgaveType;
}

export const Type = ({ type }: Props) => <LabelMain>{useTypeNameFromId(type)}</LabelMain>;
