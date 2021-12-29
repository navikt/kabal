import React from 'react';
import { useTypeFromId } from '../../hooks/use-kodeverk-ids';
import { OppgaveType } from '../../redux-api/oppgavebehandling-common-types';
import { LabelMain } from '../../styled-components/labels';

interface Props {
  type: OppgaveType;
}

export const Type = ({ type }: Props) => <LabelMain>{useTypeFromId(type)}</LabelMain>;
