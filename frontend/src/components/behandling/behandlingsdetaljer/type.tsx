import React from 'react';
import { useTypeFromId } from '../../../hooks/use-kodeverk-ids';
import { OppgaveType } from '../../../redux-api/oppgavebehandling-common-types';
import { LabelType } from '../../../styled-components/labels';
import { SubSection } from './sub-section';

interface LabelsProps {
  typeId: OppgaveType;
}

export const Type = ({ typeId }: LabelsProps) => {
  const typeName = useTypeFromId(typeId);

  return (
    <SubSection label="Type">
      <LabelType type={typeId}>{typeName}</LabelType>
    </SubSection>
  );
};
