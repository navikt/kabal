import React from 'react';
import { useTypeFromId } from '../../../hooks/use-kodeverk-ids';
import { LabelType } from '../../../styled-components/labels';
import { SubSection } from './sub-section';

interface LabelsProps {
  typeId: string;
}

export const Type = ({ typeId }: LabelsProps) => {
  const typeName = useTypeFromId(typeId);

  return (
    <SubSection label="Type">
      <LabelType>{typeName}</LabelType>
    </SubSection>
  );
};
