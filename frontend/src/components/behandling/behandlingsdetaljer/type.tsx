import React from 'react';
import { useTypeNameFromId } from '../../../hooks/use-kodeverk-ids';
import { LabelType } from '../../../styled-components/labels';
import { OppgaveType } from '../../../types/kodeverk';
import { SubSection } from './sub-section';

interface LabelsProps {
  typeId: OppgaveType;
}

export const Type = ({ typeId }: LabelsProps) => {
  const typeName = useTypeNameFromId(typeId);

  return (
    <SubSection label="Type">
      <LabelType type={typeId}>{typeName}</LabelType>
    </SubSection>
  );
};
