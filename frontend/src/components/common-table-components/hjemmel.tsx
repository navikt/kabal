import React from 'react';
import { useHjemmelFromId } from '../../hooks/use-kodeverk-ids';
import { OppgaveType } from '../../redux-api/oppgavebehandling-common-types';
import { LabelMain } from '../../styled-components/labels';

interface Props {
  type: OppgaveType;
  hjemmel: string;
}

export const Hjemmel = ({ type, hjemmel }: Props) => <LabelMain>{useHjemmelFromId(type, hjemmel)}</LabelMain>;
