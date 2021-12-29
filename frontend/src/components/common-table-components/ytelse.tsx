import React from 'react';
import { useFullYtelseNameFromId } from '../../hooks/use-kodeverk-ids';
import { OppgaveType } from '../../redux-api/oppgavebehandling-common-types';
import { LabelTema } from '../../styled-components/labels';

interface Props {
  type: OppgaveType;
  ytelseId: string;
}

export const Ytelse = ({ type, ytelseId }: Props) => <LabelTema>{useFullYtelseNameFromId(type, ytelseId)}</LabelTema>;
